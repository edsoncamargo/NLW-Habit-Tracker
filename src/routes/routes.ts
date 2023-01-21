import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

import dayjs from 'dayjs';

export async function appRoutes(app: FastifyInstance) {
    createHabit(app);
    getHabitByDay(app);
    toggleHabitStatus(app);
    getSummaryOfDays(app);
}

function createHabit(app: FastifyInstance) {
    app.post('/habits', async (req) => {
        const createHabitBody = z.object({
            title: z.string(),
            habitWeekDays: z.array(z.number().min(0).max(6))
        });

        const { title, habitWeekDays } = createHabitBody.parse(req.body);
        const today = dayjs().startOf('day').toDate();

        await prisma.habit.create({
            data: {
                title: title,
                created_at: today,
                habitWeekDays: {
                    create: habitWeekDays.map(habitWeekDay => {
                        return {
                            week_day: habitWeekDay
                        };
                    })
                }
            }
        });
    });
}

function getHabitByDay(app: FastifyInstance) {
    app.get('/day', async (req) => {
        const getDayParams = z.object({
            date: z.coerce.date()
        })

        const { date } = getDayParams.parse(req.query);

        const parsedDate = dayjs(date).startOf('day')
        const weekDay = parsedDate.get('day');


        const habits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date
                },
                habitWeekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate()
            },
            include: {
                dayHabits: true
            }
        })

        const completedHabits = day?.dayHabits.map((dayHabit) => {
            return dayHabit.habit_id
        }) ?? [];

        return {
            habits,
            completedHabits
        }
    })
}

function toggleHabitStatus(app: FastifyInstance) {
    app.patch('/habits/:id/toggle', async (req) => {
        const toggleHabitParams = z.object({
            id: z.string().uuid()
        });

        const { id } = toggleHabitParams.parse(req.params);
        const today = dayjs().startOf('day').toDate();

        let day = await prisma.day.findUnique({
            where: {
                date: today
            }
        });

        if (Boolean(day) === false) {
            day = await prisma.day.create({
                data: {
                    date: today,
                }
            });
        }

        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day!.id,
                    habit_id: id
                }
            }
        })

        if (dayHabit) {
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            })
        } else {
            await prisma.dayHabit.create({
                data: {
                    day_id: day!.id,
                    habit_id: id
                }
            });
        }
    })
}

function getSummaryOfDays(app: FastifyInstance) {
    app.get('/summary', async (req) => {
        const summary = await prisma.$queryRaw`
            SELECT 
                D.id, D.date,
                (
                    SELECT
                        cast(count(*) as float)
                    FROM day_habits DH
                    WHERE DH.day_id = D.id
                ) as completed,
                (
                    SELECT
                        cast(count(*) as float)
                    FROM habit_week_days HWD
                    JOIN habit H
                        ON H.id = HWD.habit_id
                    WHERE
                        HWD.week_day = cast(strftime('%w',D.date/1000.0, 'unixepoch') as int)
                        AND H.created_at <= D.date
                ) as amount
            FROM days D
        `

        return summary;
    })
}
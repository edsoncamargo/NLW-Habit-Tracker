import { View, ScrollView, Text, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";

interface HabitParams {
  date: string;
}

interface HabitsInfo {
  habits: Array<{ id: string; title: string; created_at: string }>;
  completedHabits: Array<string>;
}

export function Habit() {
  const [loading, setLoading] = useState(true);
  const [habitInfo, setHabitInfo] = useState<HabitsInfo | null>(null);
  const [completedHabits, setCompletedHabits] = useState<Array<string>>([]);
  const route = useRoute();
  const { date } = route.params as HabitParams;

  const percentCompleted = generateProgressPercentage(
    completedHabits.length,
    habitInfo?.habits.length
  );

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/YY");

  const isPreviousToday = dayjs(date)
    .endOf("day")
    .isBefore(dayjs(new Date()).endOf("day"));

  useEffect(() => {
    getHabitsByDate();
  }, []);

  async function handleToggleHabit(id: string) {
    if (isPreviousToday !== true) {
      try {
        await api.patch(`habits/${id}/toggle`);

        if (completedHabits.includes(id)) {
          setCompletedHabits(
            completedHabits.filter((completedId) => completedId !== id)
          );
        } else {
          setCompletedHabits([...completedHabits, id]);
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Ops!", "Error when trying to update.");
      }
    } else {
      Alert.alert(
        "You're kidding!",
        "It is not possible to change the habit of a day that has passed 😂"
      );
    }
  }

  async function getHabitsByDate() {
    try {
      setLoading(true);
      const response = await api.get("day", { params: { date } });
      setHabitInfo(response.data);
      setCompletedHabits(response.data.completedHabits);
    } catch (error) {
      console.error(error);
      Alert.alert("Ops!", "Not found habit =(");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <BackButton></BackButton>

      <Text className="text-zinc-400 mt-6 font-semibold text-base lowercase">
        {dayOfWeek}
      </Text>
      <Text className="text-white font-extrabold text-3xl lowercase">
        {dayAndMonth}
      </Text>

      <ProgressBar progress={percentCompleted}></ProgressBar>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        className="mt-6"
      >
        <View className={clsx("", { "opacity-50": isPreviousToday })}>
          {habitInfo && habitInfo.habits.length > 0 ? (
            habitInfo!.habits.map((habit, index) => (
              <Checkbox
                key={`${habit.title}-${index}`}
                title={habit.title}
                checked={completedHabits.includes(habit.id)}
                onPress={() => handleToggleHabit(habit.id)}
              />
            ))
          ) : (
            <HabitsEmpty date={date} />
          )}
        </View>
      </ScrollView>

      {isPreviousToday && (
        <Text className="text-white mb-8 text-center">
          You cannot change a habit from a past date ⚠️
        </Text>
      )}
    </View>
  );
}

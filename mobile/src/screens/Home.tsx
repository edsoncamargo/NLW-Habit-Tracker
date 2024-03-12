import { Text, View, ScrollView, Alert } from "react-native";
import { Header } from "../components/Header";
import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { api } from "../lib/axios";
import { useCallback, useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import dayjs from "dayjs";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDatesSizes = 18 * 7;
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length;

type Summary = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>;

export function Home() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary>([]);
  const { navigate } = useNavigation();

  async function getSummary() {
    try {
      setLoading(true);
      const response = await api.get("summary");
      console.log("entrei");
      setSummary(response.data);
    } catch (error) {
      Alert.alert("Ops!", "Not found summary =(");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getSummary();
    }, [])
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="bg-background flex-1 px-8 pt-16">
      <Header />

      <View className="flex-row mt-12">
        {weekDays.map((weekDay, index) => (
          <Text
            key={`${weekDay}-${index}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE, height: DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {summary && (
          <View className="flex-row flex-wrap">
            {datesFromYearStart.map((dateFromYearStart, index) => {
              const dayWithHabits = summary!.find((day) => {
                return dayjs(dateFromYearStart).isSame(day.date, "day");
              });

              return (
                <HabitDay
                  key={`${dateFromYearStart}-${index}`}
                  date={dateFromYearStart.toISOString()}
                  completed={dayWithHabits?.completed}
                  amount={dayWithHabits?.amount}
                  onPress={() =>
                    navigate("habit", { date: dateFromYearStart.toISOString() })
                  }
                ></HabitDay>
              );
            })}

            {amountOfDaysToFill > 0 &&
              Array.from({ length: amountOfDaysToFill }).map((_, index) => {
                return (
                  <View
                    key={`${index}-dumb`}
                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                    style={{ width: DAY_SIZE, height: DAY_SIZE }}
                  />
                );
              })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

import { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { BackButton } from '../components/BackButton';
import colors from 'tailwindcss/colors';
import { Checkbox } from '../components/Checkbox';
import { Feather } from '@expo/vector-icons';
import { api } from '../lib/axios';
import clsx from 'clsx';

const avaibleWeekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export function New() {
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [title, setTitle] = useState('');

  function handleToggleWeek(weekDayIndex: number) {
    if (weekDays.includes(weekDayIndex)) {
      setWeekDays((prevState) =>
        prevState.filter((weekDay) => weekDay !== weekDayIndex)
      );
    } else {
      setWeekDays((prevState) => [...prevState, weekDayIndex]);
    }
  }

  async function createNewHabit() {
    try {
      if (!title.trim() || weekDays.length === 0) {
        Alert.alert(
          'Ops!',
          'You should type a text and check one recurrence =/'
        );
        return;
      }

      await api.post('habits', {
        title,
        habitWeekDays: weekDays,
      });

      setTitle('');
      setWeekDays([]);

      Alert.alert('New habit', 'New habit created successfully =)');
    } catch (error) {
      Alert.alert('Ops!', 'Server error =(');
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <BackButton />

      <Text className="mt-6 text-white font-extrabold text-3xl">Add habit</Text>

      <Text className="mt-6 text-white font-semibold text-base">
        What is your commitment?
      </Text>
      <TextInput
        className="h-12 pl-4 rounded-lg mt-3 bg-zinc-800 text-white focus:border-2 focus:border-violet-800 mb-6"
        selectionColor={colors.violet[400]}
        placeholder="ex: workouts, sleep well, etc..."
        placeholderTextColor={colors.zinc[400]}
        onChangeText={setTitle}
        value={title}
      />
      <Text className="mt-3 mb-3 text-white font-semibold text-base">
        What is the recurrence?
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {avaibleWeekDays.map((weekDay, index) => (
          <Checkbox
            key={`${weekDay}-${index}`}
            title={weekDay}
            checked={weekDays.includes(index)}
            onPress={() => handleToggleWeek(index)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        className={clsx(
          'w-full h-14 mb-3 bg-violet-600 flex-row items-center justify-center rounded-md mt-6',
          {}
        )}
        activeOpacity={0.7}
        onPress={createNewHabit}
      >
        <Feather name="plus" size={20} color={colors.white} />
        <Text className="font-semibold text-base text-white ml-2">Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}

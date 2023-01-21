import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Text, View } from 'react-native';

interface HabitsEmptyProps {
  date: string;
}

export function HabitsEmpty({ date }: HabitsEmptyProps) {
  const { navigate } = useNavigation();
  const isPreviousToday = dayjs(date)
    .endOf('day')
    .isBefore(dayjs(new Date()).endOf('day'));

  return (
    <View>
      {isPreviousToday === false ? (
        <Text className="text-zinc-400 text-base">
          No habit created yet 😣{'   \n'}
          <Text
            className="text-violet-400 text-base underline active:text-violet-500"
            onPress={() => navigate('new')}
          >
            Let's go create now ➕
          </Text>
        </Text>
      ) : (
        <Text className="text-zinc-400 text-base">
          No habit had been created that day 😣{'   \n'}
        </Text>
      )}
    </View>
  );
}

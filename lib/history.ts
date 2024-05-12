'use client';

import { useLocalStorage } from "@mantine/hooks";
import { ClacHistories, ClacHistoryItem } from "./types";

const maxSize = 50;

export default function useHistory() {
  const [histories, setHistories] = useLocalStorage<ClacHistories>({
    key: 'calculate-histories',
    defaultValue: [],
  });

  const addHistory = (history: ClacHistoryItem) => {
    const newHistories = [history, ...histories];
    if (histories.length >= maxSize) {
      newHistories.pop();
    }
    setHistories(newHistories);
  };

  const addComment = (index: number, comment: string) => {
    const newHistories = [...histories];
    newHistories[index].comment = comment;
    setHistories(newHistories);
  };

  return {
    histories,
    addHistory,
    addComment,
  };
}

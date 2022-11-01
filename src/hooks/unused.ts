import { ref } from 'vue';
import { searchUnusedListByName } from '@/api/ruleConfig/index';

export function useSearchUnused() {
  const unusedList = ref<any>([]);
  const setUnusedList = async (name) => {
    const { retData } = (await searchUnusedListByName({ name })) as any;
    unusedList.value = retData;
  };
  return {
    setUnusedList,
    unusedList,
  };
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifyError, notifySuccess } from '../../../components/alert/Alert';
import {
  PEOPLE_UPDATE_ERROR_MESSAGE,
  PeopleUpdateInput,
  updatePeople,
} from '../api/PeopleApi';
import { peopleSearchKeys } from './usePeopleSearch';

export const usePeopleUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PeopleUpdateInput) => updatePeople(input),
    retry: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: peopleSearchKeys.all });
      notifySuccess();
    },
    onError: () => {
      notifyError(
        PEOPLE_UPDATE_ERROR_MESSAGE,
        'Update could not be completed',
        'Please try again or contact support.',
      );
    },
  });
};

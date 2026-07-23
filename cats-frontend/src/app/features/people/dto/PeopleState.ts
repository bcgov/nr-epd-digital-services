import { ChangeTracker } from '../../../components/common/IChangeType';
import { RequestStatus } from '../../../helpers/requests/status';
import { UserType } from '../../../helpers/requests/userType';
import { Peoples } from './People';
import { PeopleSearchCriteria } from './PeopleSearchTypes';

export class PeopleState {
  peoples: Peoples[] = [];
  error: string = '';
  fetchStatus: string = RequestStatus.idle;
  deleteStatus: string = RequestStatus.idle;
  addedStatus: string = RequestStatus.idle;
  updateStatus: string = RequestStatus.idle;
  searchQuery: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  resultsCount: number = 0;
  // Latest People search criteria dispatched to the Saga, recorded so future
  // workflows (e.g. a post-update refresh) can reuse it without component
  // orchestration.
  lastSearchCriteria: PeopleSearchCriteria | null = null;
  changeTracker: ChangeTracker[] = [];
  // peopleDetailsMode: PeopleDetailsMode = PeopleDetailsMode.ViewOnlyMode;
  resetPeopleDetails: boolean = false;
  userType: UserType = UserType.External;
}

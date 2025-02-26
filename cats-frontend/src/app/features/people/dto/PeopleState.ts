import { ChangeTracker } from '../../../components/common/IChangeType';
import { RequestStatus } from '../../../helpers/requests/status';
import { UserType } from '../../../helpers/requests/userType';
// import { PeopleDetailsMode } from '../../details/dto/PeopleDetailsMode';
import { PeopleResultDto, Peoples } from './People';

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
  peopleDetails?: Peoples | null = null;
  peopleDetailsFetchStatus: string = RequestStatus.idle;
  peopleDetailsDeleteStatus: string = RequestStatus.idle;
  peopleDetailsAddedStatus: string = RequestStatus.idle;
  peopleDetailsUpdateStatus: string = RequestStatus.idle;
  changeTracker: ChangeTracker[] = [];
  // peopleDetailsMode: PeopleDetailsMode = PeopleDetailsMode.ViewOnlyMode;
  resetPeopleDetails: boolean = false;
  userType: UserType = UserType.External;
}

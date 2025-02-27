import { ApplicationResultDto } from "./applicationResults/applicationResultDto";
import { SEARCH_APPLICATIONS as searchApplicationsGql } from "./graphql/searchApplications";
import { getAuthenticatedApolloClient } from "../../../helpers/utility";
import { Filter } from "./searchSlice";

const client = getAuthenticatedApolloClient();

export async function searchApplications(
  searchString: string,
  page: number,
  pageSize: number,
  filter: Filter
): Promise<{ applications: ApplicationResultDto[]; count: number }> {
  const { data } = await client.query({
    query: searchApplicationsGql,
    variables: { searchParam: searchString, page, pageSize, filter },
  });

  return {
    applications: data.searchApplications.applications,
    count: data.searchApplications.count,
  };
}

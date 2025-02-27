import { Peoples } from "../../../people/dto/People";

export class ApplicationResultDto {
  id: string;
  siteId: string;
  siteAddress: string;
  applicationType: string;
  lastUpdated: string;
  status: string;
  staffAssigned: Peoples[];
  priority: string;
  url: string;

  constructor() {
    this.id = "";
    this.siteId = "";
    this.siteAddress = "";
    this.applicationType = "";
    this.lastUpdated = "";
    this.status = "";
    this.staffAssigned = [];
    this.priority = "";
    this.url = "";
  }
}

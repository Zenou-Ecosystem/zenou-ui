export interface IModal {
  severity: "INFO" | "SUCCESS" | "DANGER" | "WARNING",
  headerText: string;
  bodyText: string;
  actions?: Actions[];
}

interface Actions {
  name: string;
  onClick: () => any;
}

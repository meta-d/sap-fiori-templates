namespace zm.appstore;

using {
  Currency,
  managed,
  cuid,
  sap
} from '@sap/cds/common';

entity PersContainers : cuid, managed {
  appId    : String(100);
  category : String(50);
  appName  : String(100);
  value    : String(5000);
}

type User {
  ID   : UUID @(Core.Computed: true);
  Name : String(100);
}

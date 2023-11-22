namespace zm.appstore;

using {
  Currency,
  managed,
  sap
} from '@sap/cds/common';

entity PersContainers : managed {
  key ID       : UUID @(Core.Computed: true);
      category : String(50);
      appName  : String(100);
      value    : String;
}


type User {
  ID   : UUID @(Core.Computed: true);
  Name : String(100);
}

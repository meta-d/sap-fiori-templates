using {zm.appstore as my} from '../db/schema';

service PersonalizationService @(requires: 'authenticated-user', ) {
    entity PersContainers as projection on my.PersContainers
}

using {zm.appstore as my} from '../db/schema';

@impl: 'srv/impl/auth-service-handler.js'
service AuthService @(
  requires: 'authenticated-user',
  path    : '/auth'
) {
  function current() returns my.User;
}

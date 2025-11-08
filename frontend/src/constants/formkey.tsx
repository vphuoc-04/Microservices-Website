export const USER_KEYS_TO_CHECK = [
  'img',
  'lastName',
  'middleName',
  'firstName',
  'email',
  'phone',
  'birthDate',
  'gender',
  'userCatalogueId'
] as const

export const PERMISSION_KEYS_TO_CHECK = [
  'name',
  'description',
  'publish'
] as const

export const USER_CATALOGUE_KEYS_TO_CHECK = [
  'name',
  'publish',
  'permissions'
] as const
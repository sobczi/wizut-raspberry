// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  login: '/api/rest-auth/login/',
  logout: '/api/rest-auth/logout/',
  data: '/account/api/get_all_data',
  dataByDate: (dateFrom: string, dateTo: string) =>
    `/account/api/get_data_by_date/?start_date_after=${dateFrom}&start_date_before=${dateTo}`,
  imageAccess: 'http://82.145.73.141:8000'
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

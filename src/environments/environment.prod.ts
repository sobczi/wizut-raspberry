export const environment = {
  production: true,
  login: '/api/rest-auth/login/',
  logout: '/api/rest-auth/logout/',
  data: '/account/api/get_all_data',
  dataByDate: (dateFrom: string, dateTo: string) =>
    `/account/api/get_data_by_date/?start_date_after=${dateFrom}&start_date_before=${dateTo}`,
  imageAccess: 'http://82.145.73.141:8000'
}

export enum ErrorType {
	NoAuth = "User is Unauthenticated",
	NoPermission = "You do not have permission to take that action",
	ValidationError = "An Error occured validating the data",
}

export enum IntegrationErrorType {
	APIError = "An error occured fetching data from the API",
}

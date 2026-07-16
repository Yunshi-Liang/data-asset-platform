let sessionApplications = []

export const addSessionApplication = (application) => {
  sessionApplications = [application, ...sessionApplications]
}

export const getSessionApplications = () => sessionApplications

export interface AuthModel {
  token: string
  refreshToken: string
}

export interface UserAddressModel {
  addressLine: string
  city: string
  state: string
  postCode: string
}

export interface UserCommunicationModel {
  email: boolean
  sms: boolean
  phone: boolean
}

export interface UserEmailSettingsModel {
  emailNotification?: boolean
  sendCopyToPersonalEmail?: boolean
  activityRelatesEmail?: {
    youHaveNewNotifications?: boolean
    youAreSentADirectMessage?: boolean
    someoneAddsYouAsAsAConnection?: boolean
    uponNewOrder?: boolean
    newMembershipApproval?: boolean
    memberRegistration?: boolean
  }
  updatesFromKeenthemes?: {
    newsAboutKeenthemesProductsAndFeatureUpdates?: boolean
    tipsOnGettingMoreOutOfKeen?: boolean
    thingsYouMissedSindeYouLastLoggedIntoKeen?: boolean
    newsAboutStartOnPartnerProductsAndOtherServices?: boolean
    tipsOnStartBusinessProducts?: boolean
  }
}

export interface UserSocialNetworksModel {
  linkedIn: string
  facebook: string
  twitter: string
  instagram: string
}

export interface FirebaseUser {
  uid: string
  email: string
  emailVerified: boolean
  displayName: string
  photoURL?: string
  profile?: {
    role?: string
    isVerified?: boolean
    companyName?: string
    companySite?: string
  }
  isAnonymous: boolean
  providerData: ProviderData[]
  stsTokenManager: {
    refreshToken: string
    accessToken: string
    expirationTime: number
  }
  createdAt: string
  lastLoginAt: string
  apiKey: string
  appName: string
}

interface ProviderData {
  providerId: string
  uid: string
  displayName: string
  email: string
  phoneNumber: string | null
  photoURL: string | null
}

// ProfileModel.ts
export interface ProfileModel {
  _id: string
  profilePicture: string | null
  companyName: string | null
  country: string | null
  communicationMethods: string[]
  allowProfileChanges: boolean | null
  companySite: string | null
  role: string | null
  totalProjects: number | null
  successRate: number | null
  location: string | null
  isVerified: boolean | null
  profileCompletion: number | null
  userId: string
  deletedAt: string | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

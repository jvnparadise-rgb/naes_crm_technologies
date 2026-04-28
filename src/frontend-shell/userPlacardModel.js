export function createUserPlacardModel({
  name = 'Jeff Yarbrough',
  title = 'VP of Operations',
  profile = 'Admin',
  photoUrl = null
} = {}) {
  return {
    type: 'UserPlacard',
    name,
    title,
    profile,
    photoUrl,
    layout: {
      textStack: 'left',
      photoPosition: 'right'
    }
  };
}

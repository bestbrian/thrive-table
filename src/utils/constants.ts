export const TABLE = {
  ROW_HEIGHT: 56,
  OVERSCAN: 10,
  COLUMN_SIZES: {
    'sm': 1,
    'md': 1.5,
    'lg': 3,
    'xl': 4,
    'default': 2,
  },
  COLUMN_SIZE_MAP: {
    'dsr': 'sm',
    'firstName': 'md',
    'lastName': 'md',
    'city': 'md',
    'fullName': 'md',
    'registeredDate': 'md',
    'id': 'md'
  }
};

export const DATE_FORMAT = {
  SHORT: { month: 'short', day: 'numeric', year: 'numeric' },
  LONG: { month: 'long', day: 'numeric', year: 'numeric' },
};

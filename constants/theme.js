import { COLORS } from './colors';

export const THEME = {
  colors: COLORS,
  spacing: (n = 1) => 8 * n,
  fonts: {
    title: {
      fontFamily: 'simsun',
      fontSize: 22,
      color: COLORS.TEXT,
    },
    subtitle: {
      fontFamily: 'simsun',
      fontSize: 18,
      color: COLORS.TEXT,
    },
    body: {
      fontFamily: 'simsun',
      fontSize: 16,
      color: COLORS.TEXT,
    },
    small: {
      fontFamily: 'simsun',
      fontSize: 14,
      color: COLORS.TEXT,
    },
  },
  buttonPrimary: {
    backgroundColor: COLORS.ORANGE,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: COLORS.GREENBLUE,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'simsun',
    fontSize: 16,
    color: COLORS.TEXT,
    backgroundColor: COLORS.WHITE,
  },
};

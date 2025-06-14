import PropTypes from 'prop-types';
import { ListSubheader, styled, Theme } from '@mui/material';

type NavGroup = {
  navlabel?: boolean;
  subheader?: string;
};

interface ItemType {
  item: NavGroup;
}

const NavGroup = ({ item }: ItemType) => {
  const ListSubheaderStyle = styled((props: Theme | any) => <ListSubheader disableSticky {...props} />)(
    ({ theme }) => ({
      ...theme.typography.overline,
      fontWeight: '700',
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(0),
      color: theme.palette.text.primary,
      lineHeight: '26px',
      padding: '3px 12px',
      textAlign: 'center',
      whiteSpace: 'pre-line', // Penting agar \n berubah jadi line break
    }),
  );

  return <ListSubheaderStyle>{item.subheader}</ListSubheaderStyle>;
};

NavGroup.propTypes = {
  item: PropTypes.object,
};

export default NavGroup;

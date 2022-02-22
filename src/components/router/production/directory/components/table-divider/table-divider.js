// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { type Node, Component } from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ElypsisIcon from "static/images/elypsis.svg";
import SharingIcon from "static/images/sharing.svg";
import css from "./table-divider.style.css";

type Props = {
  +collectionName: string,
  +counter?: number
};

type State = Object;

class TableDivider extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { collectionName = "" } = props;

    this.state = {
      [`${collectionName}shareEl`]: null,
      [`${collectionName}moreEl`]: null
    };
  }

  handleClick = (event: SyntheticEvent<HTMLButtonElement>, element: string) => {
    this.setState({
      [element]: event.currentTarget
    });
  };

  handleClose = (element: string) => {
    this.setState({
      [element]: null
    });
  };

  renderUsers = (): Node => {
    const users = [
      {
        avatar:
          "https://www.thefix.com/sites/default/files/styles/article/public/brad-pitt-fix.jpg"
      },
      {
        avatar:
          "https://www.thefix.com/sites/default/files/styles/article/public/brad-pitt-fix.jpg"
      },
      {
        avatar:
          "https://www.thefix.com/sites/default/files/styles/article/public/brad-pitt-fix.jpg"
      }
    ];

    return users.map(user => (
      <img src={user.avatar} alt="user" className={css.userAvatar} />
    ));
  };

  renderMoreUsers = () => <span className={css.moreUsers}>+2</span>;

  render() {
    const { collectionName, counter } = this.props;

    const shareEl = this.state[`${collectionName}shareEl`];
    const moreEl = this.state[`${collectionName}moreEl`];

    return (
      <div className={css.divider}>
        <span>
          {collectionName} {counter && `(${counter})`}
        </span>
        <span>
          <img src={SharingIcon} alt="share" className={css.sharingIcon} />
          <Button
            aria-owns={shareEl ? `${collectionName}shareEl` : null}
            aria-haspopup="true"
            onClick={e => this.handleClick(e, `${collectionName}shareEl`)}
            classes={{
              root: css.button,
              label: css.buttonLabel
            }}
          >
            Dept Visible
            <ArrowDownIcon className={css.arrowDownIcon} />
          </Button>
          <Menu
            id={`${collectionName}shareEl`}
            anchorEl={shareEl}
            open={Boolean(shareEl)}
            onClose={() => this.handleClose(`${collectionName}shareEl`)}
          >
            <MenuItem
              onClick={() => this.handleClose(`${collectionName}shareEl`)}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => this.handleClose(`${collectionName}shareEl`)}
            >
              My account
            </MenuItem>
            <MenuItem
              onClick={() => this.handleClose(`${collectionName}shareEl`)}
            >
              Logout
            </MenuItem>
          </Menu>
          <span className={css.usersContainer}>{this.renderUsers()}</span>
          {this.renderMoreUsers()}
          <Button
            aria-owns={moreEl ? `${collectionName}moreEl` : null}
            aria-haspopup="true"
            onClick={e => this.handleClick(e, `${collectionName}moreEl`)}
            classes={{
              root: css.moreButton,
              label: css.buttonLabel
            }}
          >
            <img src={ElypsisIcon} alt="more" className={css.elypsisIcon} />
          </Button>
          <Menu
            id={`${collectionName}moreEl`}
            anchorEl={moreEl}
            open={Boolean(moreEl)}
            onClose={() => this.handleClose(`${collectionName}moreEl`)}
          >
            <MenuItem
              onClick={() => this.handleClose(`${collectionName}moreEl`)}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => this.handleClose(`${collectionName}moreEl`)}
            >
              My account
            </MenuItem>
            <MenuItem
              onClick={() => this.handleClose(`${collectionName}moreEl`)}
            >
              Logout
            </MenuItem>
            <MenuItem
              onClick={() => this.handleClose(`${collectionName}moreEl`)}
            >
              Logout
            </MenuItem>
            <MenuItem
              onClick={() => this.handleClose(`${collectionName}moreEl`)}
            >
              Logout
            </MenuItem>
          </Menu>
        </span>
      </div>
    );
  }
}

export default TableDivider;

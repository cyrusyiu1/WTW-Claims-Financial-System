import classNames from 'classnames';
import React from 'react';
import { Nav } from 'react-bootstrap';
import Avatar from './Avatar';

//
// Header
//

const Header: any = React.forwardRef<unknown, any>(({ as: Tag = 'div', className, ...props }, ref) => {
  const classes = classNames('header', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

//
// Header avatar top
//

Header.AvatarTop = React.forwardRef<unknown, any>(({ className, ...props }, ref) => {
  const classes = classNames('header-avatar-top', className);

  return <Avatar className={classes} ref={ref} {...props} />;
});

//
// Header body
//

Header.Body = React.forwardRef<unknown, any>(({ as: Tag = 'div', className, ...props }, ref) => {
  const classes = classNames('header-body', className);

  return <Tag className={classes} ref={ref} {...props} />;
});


//
// Header footer
//

Header.Footer = React.forwardRef<unknown, any>(({ as: Tag = 'div', className, ...props }, ref) => {
  const classes = classNames('header-footer', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

//
// Header image top
//

Header.ImageTop = React.forwardRef<unknown, any>(({ as: Tag = 'img', className, ...props }, ref) => {
  const classes = classNames('header-img-top', className);

  return <Tag className={classes} ref={ref} {...props} />;
});


//
// Header pretitle
//

Header.Pretitle = React.forwardRef<unknown, any>(({ as: Tag = 'h6', className, ...props }, ref) => {
  const classes = classNames('header-pretitle', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

//
// Header subtitle
//

Header.Subtitle = React.forwardRef<unknown, any>(({ as: Tag = 'p', className, ...props }, ref) => {
  const classes = classNames('header-subtitle', className);

  return <Tag className={classes} ref={ref} {...props} />;
});


//
// Header tabs
//

Header.Tabs = React.forwardRef<unknown, any>(({ className, ...props }, ref) => {
  const classes = classNames('header-tabs', className);

  return <Nav variant="tabs" className={classes} ref={ref} {...props} />;
});

//
// Header title
//

Header.Title = React.forwardRef<unknown, any>(({ as: Tag = 'h1', className, ...props }, ref) => {
  const classes = classNames('header-title', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

export default Header;

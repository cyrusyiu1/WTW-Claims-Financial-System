import classNames from 'classnames';
import React from 'react';

//
// Avatar
//

const Avatar: any = React.forwardRef<unknown, any>(({ as: Tag = 'div', ratio, size, status, className, ...props }, ref) => {
  const classes = classNames('avatar', ratio && `avatar-${ratio}`, size && `avatar-${size}`, status && `avatar-${status}`, className);

  return <Tag className={classes} ref={ref} {...props} />;
});

// Avatar group
//

Avatar.Group = React.forwardRef<unknown, any>(({ as: Tag = 'div', className, ...props }, ref) => {
  const classes = classNames('avatar-group', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

//
// Avatar image
//

Avatar.Image = React.forwardRef<unknown, any>(({ as: Tag = 'img', className, ...props }, ref) => {
  const classes = classNames('avatar-img', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

//
// Avatar title
//

Avatar.Title = React.forwardRef<unknown, any>(({ as: Tag = 'div', className, ...props }, ref) => {
  const classes = classNames('avatar-title', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

export default Avatar;

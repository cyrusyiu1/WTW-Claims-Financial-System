import classNames from 'classnames';
import React from 'react';

//
// Icon
//

const Icon = React.forwardRef<unknown, any>(({ as: Tag = 'div', active, className, ...props }, ref) => {
  const classes = classNames('icon', active && 'active', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

export default Icon;

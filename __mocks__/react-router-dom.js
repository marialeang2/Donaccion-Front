// __mocks__/react-router-dom.js
import React from 'react';
export const Link = ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>;
// Add any additional exports if needed
export default {
  Link,
};

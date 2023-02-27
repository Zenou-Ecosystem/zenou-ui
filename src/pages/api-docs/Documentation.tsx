import React from 'react';
import SwaggerUIReact from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

function Documentation() {
    return <SwaggerUIReact url="http://localhost:3000/api" />;
}

export default Documentation;
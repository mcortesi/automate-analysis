import 'bootstrap/less/bootstrap.less';
import './stylesheets/main.less';

import React from 'react';
import App from './components/App';

main();

function main() {
    var app = document.createElement('div');
    app.classList.add('container');
    document.body.appendChild(app);

    React.render(<App />, app);
}

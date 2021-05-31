# -large--devicemanagement
My first real project. Web service for collecting and managing data of devices, sold by company. Tech used: NodeJS, Express, EJS, Bootstrap, Yandex API's. Hosted here - https://device-db-manage.herokuapp.com/

## Description
My first commercial project for product-accounting of electrotechnical company.
Was developed in summer 2020 and supported subsequently. I'm planning to make a total rework and migrate to React/NextJS in summer 2021.

This system serves to manage a database of sold devices. The main requirements:
- Authentication required, this is company's employee only web app.
- Home page should display the main counters of devices in-work and a map with them.
- Ability to create types of devices (for example "Generators", "Drives"...) with their own custom properties (and property options).
- After creating each device, a unique license-key should be generated for it and sent to corresponding manager. (This procedure is also optional for device type).
- There are different types users with different privileges: Manager, Head-Manager and Administrator.
- Ability to download the whole DB, for backup purposes.
- Sort, filter table of devices, search in a various fields with smart autocompletion. Also filter them on map.
- On-the-fly validation during submitting device-adding form (for example, if device with this serial № already exists).
- Doployment on Beget.

## Under the hood
- UI: SSR with EJS. Styling - Bootstrap 4. Client-side scripts - vanilla JS.
- Backend: Node+Express+MongoDB(Mongoose). Authentication - PassportJS. Autocompletion, geolocation and map - Yandex. Mailing - node-mailer. 

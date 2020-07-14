import mongoose from 'mongoose';

const url: string = process.env.MONGODB_URI || 'mongodb://';

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(db => console.log(`✔ Database connected to ${db.connection.host}`))
    .catch(err => console.log(err));

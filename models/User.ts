import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


export interface IUser extends mongoose.Document {
    username: string,
    firstName: string,
    lastName: string,
    password: string,
    country: string,
    token?: string,
    createdAt: Date,
    updatedAt: Date,
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    country :{
        type: String,
        required: true,
    }

}, {
    timestamps: true
});


UserSchema.pre("save", async function(next) {
    const user = this as IUser;

    // Check if the username is modified and if it already exists
    if (user.isModified("username")) {
        const existingUser = await mongoose.model('User').findOne({ username: user.username });
        if (existingUser) {
            const error = new Error('Username already exists');
            return next(error);
        }
    }

    // Check if the password is modified
    if (!user.isModified("password")) return next();

    // Generate salt and hash the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    
    // Update the user's password with the hashed value
    user.password = hash;

    return next();
});

UserSchema.methods.comparePassword = async function(password: string) {
    const user = this as IUser;
    return bcrypt.compareSync(password, user.password);
}

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
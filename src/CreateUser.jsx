import React, { useState } from 'react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import './App.css';

const CreateUser = () => {
    const [password, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isCreated, setIsCreated] = useState(false);

    const s3Client = new S3Client({
        region: 'YOUR_AWS_REGION',
        credentials: {
            accessKeyId: 'YOUR_AWS_ACCESS_KEY',
            secretAccessKey: 'YOUR_AWS_SECRET_KEY',
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = JSON.stringify({
            name,
            email,
            createdAt: new Date().toISOString(),
        });

        const params = {
            Bucket: 'YOUR_BUCKET_NAME',
            Key: `users/${Date.now()}_${name}.json`,
            Body: userData,
            ContentType: 'application/json',
        };

        try {
            await s3Client.send(new PutObjectCommand(params));
            setIsCreated(true);
        } catch (error) {
            console.error('Error uploading to S3:', error);
            alert('Error creating user');
        }

        setName('');
        setEmail('');
    };

    return (
        <div className="container">
            <h2>Create User</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="name">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button type="submit">Create User</button>
            </form>
            {isCreated && <p className="success-message">User created successfully!</p>}
        </div>
    );
};

export default CreateUser;

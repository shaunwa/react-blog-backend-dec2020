import express from 'express';
import chalk from 'chalk';
import { MongoClient } from 'mongodb';

const app = express();

app.use(express.json());

const startServer = async () => {
    const client = await MongoClient.connect(
        'mongodb://localhost:27017',
    );
    const db = client.db('react-blog-db-dec2020');

    app.get('/api/articles/:name', async (req, res) => {
        const { name } = req.params;
        const articleInfo = await db.collection('articles').findOne({ name });
        res.json(articleInfo);
    });

    app.post('/api/articles/:name/upvotes', async (req, res) => {
        const { name } = req.params;
        await db.collection('articles').updateOne(
            { name },
            { $inc: { upvotes: 1 } },
        );
        const updatedInfo = await db.collection('articles').findOne({ name });
        res.json(updatedInfo);
    });

    app.post('/api/articles/:name/comments', async (req, res) => {
        const { name } = req.params;
        const { text, postedBy } = req.body;
        await db.collection('articles').updateOne(
            { name },
            { $push: { comments: { text, postedBy } } },
        );
        const updatedInfo = await db.collection('articles').findOne({ name });
        res.json(updatedInfo);
    });

    const PORT = 8000;

    app.listen(PORT, () => {
        console.log(chalk.green('Server is running on') + chalk.red(` port ${PORT}`));
    });
}

startServer();
"use client";
import { useState, useEffect } from 'react'
import { fetchApi } from '@/utils/api';

const Test = () => {
    const [articles, setArticles] = useState<{ codigo: string; descripcion: string; }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchApi('articles');
                console.log(response);
                
                setArticles(response);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [])

    return (
        <div>
            <ul>
                {articles.map((article) => (
                    <li key={article.codigo}>{article.descripcion}</li>
                ))}
            </ul>
        </div>
    )
}

Test.displayName = 'Test';

export default Test;
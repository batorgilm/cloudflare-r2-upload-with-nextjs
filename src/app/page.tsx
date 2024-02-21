'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { useState } from 'react';
import axios from 'axios';

type SignedUrls = {
  uploadUrls: string[];
  accessUrls: string[];
};

export async function uploadImageIntoS3(count: number) {
  const requestURL = `/api/r2-upload?count=${count}`;

  const response = await fetch(requestURL, {
    method: 'GET',
    cache: 'no-cache',
    headers: {
      'Content-type': 'application/json',
    },
  });

  const data = await response.json();

  return data as SignedUrls;
}

export default function Home() {
  const [images, setImages] = useState<File[]>();

  const onUpload = async () => {
    const { uploadUrls, accessUrls } = await uploadImageIntoS3(images.length);
    console.log(uploadUrls, accessUrls);
    await Promise.all(
      uploadUrls.map((url, index) => {
        return axios.put(url, images[index], {
          headers: {
            'Content-Type': (images[index] as File).type,
          },
        });
      })
    );
  };
  return (
    <main className={styles.main}>
      <input
        type="file"
        placeholder="File upload"
        onChange={(event) => setImages(event.target.files)}
        multiple
      />
      <button onClick={onUpload}>Upload</button>
    </main>
  );
}

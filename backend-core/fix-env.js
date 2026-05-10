const fs = require('fs');
const serviceAccount = {
  type: "service_account",
  project_id: "kalansira-v1-app",
  private_key_id: "ef837b57549d3dc5b67f6324844c6897f1f2866d",
  private_key: "-----BEGIN PRIVATE KEY-----\\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDkwdNDYIcT3FYT\\n8zXjjnBHrngr2rfK1uXvqsOEGqpXPrkFwoph070uz05DoA8yMBCohveprN4uoH5y\\nLyTJD9UfUCiJiqh7ZrZmtyTITIgN4miP0T1j0Tqe1E0LavtG0bpGSil8EqyNI3g7\\nMTgOMZIJynrfdY+Afv1jgNIO71FimucjdBhEdAD2/s+npafX48iygkEmObnUVo2T\\n2O5pBiX+SYM3jlJN42bq+tKIIzGb0BFvjOOwwK26/3C2TzboLM7MZFoyl0U4tcP5\\ns8Os184AxOFTgxbohieFgexaAGojmriHmmSc4ZlpVi50tcsbBFlTUjZfmDNxJs/c\\nRNR54H4JAgMBAAECggEAFQALrVLoV50JvGtegjlGarg0MT9zEbCUe4HrUL5zbo60\\nJNiZBFXQN2LB2jCwkHCL6PK5+/ZCD9j9Pq2ABKK605Tz4buMT8bMPiX4PxiSgWbM\\nZ06Dwpz3sxLFj2Om9XeFsJP4lrquo0bTL+jq7tejYtl3GfpEfhz6VUcDUapr59+o\\n1GEEN9MKv1d4N0vlLxAdMHkbBZ378Vp+b0XXFG/dZ69TZkQk7x4rIhntJJPuze+V\\nV7kCQcNqCUcp1sEtJm2Gr6MRHVLSPNulCi1VokBrY+FHogBl8hSOtl7Wi5jJFnJc\\mb5UNzpyQtzDdXoeywkT0Gayj2Ta6URgBnTnFdjYkQKBgQD+4T/VktHPBi0LwA6r\\n5yu1vPHFvOZvRyck/fvck7YP7t/f1lSAkObExgzMwtANakske0H0U1jrZlW4vHn9\\nKeCLqGoIetYGa+Zsd1y2MH7K4eN04qyvI3YH353c6bV+0PpgTIEugTJYL0ncs2Dl\\no/xo0F1SXdUjiK2kK0rwNzPGUQKBgQDlwy/LPXGOh8IZUEPC7f/ELFdJ/tZJK5JW\\nQC/eX17Tdg+y3/oLILR6buFM2JICbgqg+ldZmhtlDT/U/Px/mgFjxnI/cm6gIdCg\\nxdX70Xp6O8KD8XuA8dTSgyQQslf2uMQIKuPFBbdfK1Be3y7Knp0k4E/e5EBfAnm4\\n1q8uhvB2OQKBgB+JZWmasgUooXg7ulUA1IK3Lz8lQWnxZuGH35sKV9Oe3eqHTYte\\n4n7kdn77d9zBEy0fZyjBC1aNIfwqrflqLhN5siz8bfD7dtZi6oDMfVPDIW68AVvm\\nSlttCs5jyIY5e1FhBfboG3+X0k7RjyK66KdbaMChRZcQ+VM/3BTe77QRAoGABGZb\\nePHhRdB1uBRgZ9A08KXEuicGJXqPH9W01PZQk44UOOGvIR1sN1f+OoF/Mkq3K2P/\\n3jhkQ+ggC80YbL0fP7DiKTLgyXI8U4fWVC8rwEF6tRofulVnNOzL+QHhS1k4b8ua\\ndwBoBYuHy3lMpRaqfbVJ8kO+s9MRT6fUzPhKjIkCgYBOPjjdb8JvOTlSetnFIfog\\nXeDKuGr0/hLt6Ar5nSvMRUedNQ2NuP+fa6442SrmBu/PGd7i1LiGVAPP9QuopooB\\nqcpCBvblTgaWqDXpew3b0HScpBpNbPavHD9+RRMmWs3cCfQIN6ak7wu0dA87ZkFy\\nmwR3aBVTz2U5EtSlfB9erQ==\\n-----END PRIVATE KEY-----\\n",
  client_email: "firebase-adminsdk-fbsvc@kalansira-v1-app.iam.gserviceaccount.com",
  client_id: "111631612855726982768",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40kalansira-v1-app.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

const content = `FIREBASE_SERVICE_ACCOUNT='${JSON.stringify(serviceAccount)}'\nFIREBASE_DATABASE_ID=(default)`;
fs.writeFileSync('.env', content);
console.log('.env updated successfully');

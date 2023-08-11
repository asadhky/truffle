import { Box, Button, Stack } from "@mui/material";
import { ContextValueReady } from "eth.context";
import { JobOffer } from "models";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from './index.module.css';

export default function Home({ eth }: { eth: ContextValueReady }): JSX.Element {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const getJobs = async () => {
      if (!eth.ready) return;
      setLoading(true);

      const fetchedJobs: JobOffer[] = await eth.contracts.solJobs.methods.getAllJobsCreated.call().call();
      setJobs(Array.from(fetchedJobs).sort((a, b) => b.id - a.id)); // sort from newest to oldest
      
      setLoading(false);
    }

    getJobs();

  }, [eth])

  if (loading) {
    return <p>Fetching jobs...</p>
  }

  if (!loading && jobs.length === 0) {
    return <p>No jobs found.</p>
  }

  return (
    <div>
      {jobs.map((job: JobOffer) => {
        return (
          <Stack className={styles.container} key={job.id}>
            <Box>
              <h3>{job.title}</h3>
              <span className={styles.metadata}><Link href={`/profile/c/${job.creator.creatorAddress}`}>{job.creator.name}</Link></span>
              <span className={styles.metadata}>{eth.web3.utils.fromWei(job.compensation.toString(), 'ether')} ETH</span>
            </Box>
            <Button variant="contained" size='small'>Apply</Button>
          </Stack>
        )
      })}
    </div>
  );
}

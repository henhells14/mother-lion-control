import clientPromise from '@/lib/mongodb';
import HomeClient from '@/components/HomeClient'; // Varmista että kansio on 'components'

export const revalidate = 0; // Varmistaa että luvut päivittyvät aina

async function getLiveStats() {
  try {
    const client = await clientPromise;
    // TÄRKEÄÄ: Käytetään juuri niitä nimiä mitä sanoit
    const db = client.db("productiontimetable");
    const schedule = await db.collection("productiondays").find({}).toArray();

    // Lasketaan päivät ja tapahtumat
    const dayCount = schedule.length;
    const totalEvents = schedule.reduce((acc, day) => {
      return acc + (day.mainEvents?.length || 0);
    }, 0);

    console.log(`DB Haku onnistui: ${dayCount} päivää, ${totalEvents} tapahtumaa.`);
    return { totalEvents, dayCount };
  } catch (e) {
    console.error("MongoDB haku töppäsi:", e);
    return { totalEvents: 0, dayCount: 0 };
  }
}

export default async function Home() {
  const stats = await getLiveStats();
  return <HomeClient totalEvents={stats.totalEvents} dayCount={stats.dayCount} />;
}
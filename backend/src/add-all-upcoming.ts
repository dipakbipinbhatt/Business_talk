// Script to add all upcoming podcasts with proper guest images
// Run with: npx tsx src/add-all-upcoming.ts

import mongoose from 'mongoose';
import { config } from './config/env';
import { Podcast } from './models/Podcast';

// Mapping of all upcoming podcast guests with their converted JPG images
// These are all upcoming episodes - no YouTube URLs
const upcomingPodcasts = [
    {
        guestName: "Dr. A. Susana Ramirez",
        guestTitle: "Associate Professor",
        guestInstitution: "University of California, Merced",
        thumbnailImage: "/uploads/dr-a-susana-ramirez.jpg",
        scheduledDate: "2025-01-15",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 400,
    },
    {
        guestName: "Dr. Amir Grinstein",
        guestTitle: "Professor of Marketing",
        guestInstitution: "Northeastern University",
        thumbnailImage: "/uploads/dr-amir-grinstein.jpg",
        scheduledDate: "2025-01-18",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 401,
    },
    {
        guestName: "Dr. Andrew Bernstein",
        guestTitle: "Professor",
        guestInstitution: "MIT Sloan School of Management",
        thumbnailImage: "/uploads/dr-andrew-bernstein.jpg",
        scheduledDate: "2025-01-22",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 402,
    },
    {
        guestName: "Dr. Andrew J. Hoffman",
        guestTitle: "Professor of Sustainable Enterprise",
        guestInstitution: "University of Michigan",
        thumbnailImage: "/uploads/dr-andrew-j-hoffman.jpg",
        scheduledDate: "2025-01-25",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 403,
    },
    {
        guestName: "Dr. Bann Seng Tan",
        guestTitle: "Professor",
        guestInstitution: "Singapore Management University",
        thumbnailImage: "/uploads/dr-bann-seng-tan.jpg",
        scheduledDate: "2025-01-29",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 404,
    },
    {
        guestName: "Dr. Barry Eichengreen",
        guestTitle: "Professor of Economics",
        guestInstitution: "University of California, Berkeley",
        thumbnailImage: "/uploads/dr-barry-eichengreen.jpg",
        scheduledDate: "2025-02-01",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 405,
    },
    {
        guestName: "Dr. Bella DePaulo",
        guestTitle: "Social Psychologist & Author",
        guestInstitution: "University of California, Santa Barbara",
        thumbnailImage: "/uploads/dr-bella-depaulo.jpg",
        scheduledDate: "2025-02-05",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 406,
    },
    {
        guestName: "Dr. Carles Lalueza-Fox",
        guestTitle: "Director",
        guestInstitution: "Natural Sciences Museum Barcelona",
        thumbnailImage: "/uploads/dr-carles-lalueza-fox.jpg",
        scheduledDate: "2025-02-08",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 407,
    },
    {
        guestName: "Dr. Caroline Levander",
        guestTitle: "Vice Provost for Interdisciplinary Initiatives",
        guestInstitution: "Rice University",
        thumbnailImage: "/uploads/dr-caroline-levander.jpg",
        scheduledDate: "2025-02-12",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 408,
    },
    {
        guestName: "Dr. Denis Shackel",
        guestTitle: "Professor of Management",
        guestInstitution: "ESMT Berlin",
        thumbnailImage: "/uploads/dr-denis-shackel.jpg",
        scheduledDate: "2025-02-15",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 409,
    },
    {
        guestName: "Dr. Denise M. Rousseau",
        guestTitle: "University Professor",
        guestInstitution: "Carnegie Mellon University",
        thumbnailImage: "/uploads/dr-denise-m-rousseau.jpg",
        scheduledDate: "2025-02-19",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 410,
    },
    {
        guestName: "Dr. Ericka Johnson",
        guestTitle: "Professor of Gender Studies",
        guestInstitution: "Linköping University",
        thumbnailImage: "/uploads/dr-ericka-johnson.jpg",
        scheduledDate: "2025-02-22",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 411,
    },
    {
        guestName: "Dr. Federico Pianzola",
        guestTitle: "Assistant Professor",
        guestInstitution: "University of Groningen",
        thumbnailImage: "/uploads/dr-federico-pianzola.jpg",
        scheduledDate: "2025-02-26",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 412,
    },
    {
        guestName: "Dr. Gopal Naik",
        guestTitle: "Professor",
        guestInstitution: "Indian Institute of Management Bangalore",
        thumbnailImage: "/uploads/dr-gopal-naik.jpg",
        scheduledDate: "2025-03-01",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 413,
    },
    {
        guestName: "Dr. Guneet Nagpal",
        guestTitle: "Associate Professor",
        guestInstitution: "University Business School",
        thumbnailImage: "/uploads/dr-guneet-nagpal.jpg",
        scheduledDate: "2025-03-05",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 414,
    },
    {
        guestName: "Dr. Heather Cairns-Lee",
        guestTitle: "Programme Director",
        guestInstitution: "IMD Business School",
        thumbnailImage: "/uploads/dr-heather-cairns-lee.jpg",
        scheduledDate: "2025-03-08",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 415,
    },
    {
        guestName: "Dr. Janice Byrne",
        guestTitle: "Professor of Entrepreneurship",
        guestInstitution: "IESEG School of Management",
        thumbnailImage: "/uploads/dr-janice-byrne.jpg",
        scheduledDate: "2025-03-12",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 416,
    },
    {
        guestName: "Dr. Joshua Gans",
        guestTitle: "Professor of Strategic Management",
        guestInstitution: "University of Toronto",
        thumbnailImage: "/uploads/dr-joshua-gans.jpg",
        scheduledDate: "2025-03-15",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 417,
    },
    {
        guestName: "Dr. Lindsey Cameron",
        guestTitle: "Assistant Professor",
        guestInstitution: "Wharton School, University of Pennsylvania",
        thumbnailImage: "/uploads/dr-lindsey-cameron.jpg",
        scheduledDate: "2025-03-19",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 418,
    },
    {
        guestName: "Dr. Manoj K. Thomas",
        guestTitle: "Professor of Marketing",
        guestInstitution: "Cornell University",
        thumbnailImage: "/uploads/dr-manoj-k-thomas.jpg",
        scheduledDate: "2025-03-22",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 419,
    },
    {
        guestName: "Dr. Marco Marabelli",
        guestTitle: "Associate Professor",
        guestInstitution: "Bentley University",
        thumbnailImage: "/uploads/dr-marco-marabelli.jpg",
        scheduledDate: "2025-03-26",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 420,
    },
    {
        guestName: "Dr. Maria Ballesteros-Sola",
        guestTitle: "Assistant Professor",
        guestInstitution: "California State University Channel Islands",
        thumbnailImage: "/uploads/dr-maria-ballesteros-sola.jpg",
        scheduledDate: "2025-03-29",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 421,
    },
    {
        guestName: "Dr. Martina Pasquini",
        guestTitle: "Assistant Professor",
        guestInstitution: "University of Warwick",
        thumbnailImage: "/uploads/dr-martina-pasquini.jpg",
        scheduledDate: "2025-04-02",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 422,
    },
    {
        guestName: "Dr. Melanie Brucks",
        guestTitle: "Assistant Professor of Marketing",
        guestInstitution: "Columbia Business School",
        thumbnailImage: "/uploads/dr-melanie-brucks.jpg",
        scheduledDate: "2025-04-05",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 423,
    },
    {
        guestName: "Dr. Michelle A. Amazeen",
        guestTitle: "Associate Professor",
        guestInstitution: "Boston University",
        thumbnailImage: "/uploads/dr-michelle-a-amazeen.jpg",
        scheduledDate: "2025-04-09",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 424,
    },
    {
        guestName: "Dr. Misty Heggeness",
        guestTitle: "Assistant Professor",
        guestInstitution: "University of Kansas",
        thumbnailImage: "/uploads/dr-misty-heggeness.jpg",
        scheduledDate: "2025-04-12",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 425,
    },
    {
        guestName: "Dr. Mohamed Hussein",
        guestTitle: "Associate Professor",
        guestInstitution: "University of Birmingham",
        thumbnailImage: "/uploads/dr-mohamed-hussein.jpg",
        scheduledDate: "2025-04-16",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 426,
    },
    {
        guestName: "Dr. Nirajana Mishra",
        guestTitle: "Professor",
        guestInstitution: "Indian Institute of Management",
        thumbnailImage: "/uploads/dr-nirajana-mishra.jpg",
        scheduledDate: "2025-04-19",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 427,
    },
    {
        guestName: "Dr. Peter O. Krapp",
        guestTitle: "Professor",
        guestInstitution: "University of California, Irvine",
        thumbnailImage: "/uploads/dr-peter-o-krapp.jpg",
        scheduledDate: "2025-04-23",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 428,
    },
    {
        guestName: "Dr. Raj Sharman",
        guestTitle: "Professor",
        guestInstitution: "University at Buffalo",
        thumbnailImage: "/uploads/dr-raj-sharman.jpg",
        scheduledDate: "2025-04-26",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 429,
    },
    {
        guestName: "Dr. Raphael Thomadsen",
        guestTitle: "Professor of Marketing",
        guestInstitution: "Washington University in St. Louis",
        thumbnailImage: "/uploads/dr-raphael-thomadsen.jpg",
        scheduledDate: "2025-04-30",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 430,
    },
    {
        guestName: "Dr. Tammy L. Madsen",
        guestTitle: "Professor of Strategy",
        guestInstitution: "Santa Clara University",
        thumbnailImage: "/uploads/dr-tammy-l-madsen.jpg",
        scheduledDate: "2025-05-03",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 431,
    },
    {
        guestName: "Dr. Teresa Amabile",
        guestTitle: "Professor Emerita",
        guestInstitution: "Harvard Business School",
        thumbnailImage: "/uploads/dr-teresa-amabile.jpg",
        scheduledDate: "2025-05-07",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 432,
    },
    {
        guestName: "Dr. Tucker J. Marion & Dr. Sebastian Fixson",
        guestTitle: "Professors of Innovation",
        guestInstitution: "Northeastern University",
        thumbnailImage: "/uploads/dr-tucker-j-marion-and-dr-sebastian-fixson.jpg",
        scheduledDate: "2025-05-10",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 433,
    },
    {
        guestName: "Dr. Valery Yakubovich",
        guestTitle: "Professor of Management",
        guestInstitution: "ESSEC Business School",
        thumbnailImage: "/uploads/dr-valery-yakubovich.jpg",
        scheduledDate: "2025-05-14",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 434,
    },
    {
        guestName: "Dr. Wesley David Sine",
        guestTitle: "Professor",
        guestInstitution: "Cornell University",
        thumbnailImage: "/uploads/dr-wesley-david-sine.jpg",
        scheduledDate: "2025-05-17",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 435,
    },
    {
        guestName: "Dr. Winnie Jiang",
        guestTitle: "Assistant Professor",
        guestInstitution: "INSEAD",
        thumbnailImage: "/uploads/dr-winnie-jiang.jpg",
        scheduledDate: "2025-05-21",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 436,
    },
    {
        guestName: "Dr. Yangjie Gu",
        guestTitle: "Associate Professor",
        guestInstitution: "London Business School",
        thumbnailImage: "/uploads/dr-yangjie-gu.jpg",
        scheduledDate: "2025-05-24",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 437,
    },
    {
        guestName: "Dr. Zhangxin (Frank) Liu",
        guestTitle: "Associate Professor of Finance",
        guestInstitution: "University of Queensland",
        thumbnailImage: "/uploads/dr-zhangxin-frank-liu.jpg",
        scheduledDate: "2025-05-28",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 438,
    },
    {
        guestName: "Liz Paushter",
        guestTitle: "Director of Communications",
        guestInstitution: "The Wharton School",
        thumbnailImage: "/uploads/liz-paushter.jpg",
        scheduledDate: "2025-05-31",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 439,
    },
    {
        guestName: "Prof. Anup Srivastava",
        guestTitle: "Professor of Accounting",
        guestInstitution: "University of Calgary",
        thumbnailImage: "/uploads/professor-anup-srivastava.jpg",
        scheduledDate: "2025-06-04",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 440,
    },
    {
        guestName: "Prof. Fred Selnes",
        guestTitle: "Professor of Marketing",
        guestInstitution: "BI Norwegian Business School",
        thumbnailImage: "/uploads/prof-fred-selnes.jpg",
        scheduledDate: "2025-06-07",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 441,
    },
    {
        guestName: "Prof. Gemma Anne Calvert",
        guestTitle: "Professor of Applied Neuroimaging",
        guestInstitution: "Nanyang Business School",
        thumbnailImage: "/uploads/prof-gemma-anne-calvert.jpg",
        scheduledDate: "2025-06-11",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 442,
    },
    {
        guestName: "Prof. Mark Huselid",
        guestTitle: "Distinguished Professor",
        guestInstitution: "Rutgers University",
        thumbnailImage: "/uploads/prof-mark-huselid.jpg",
        scheduledDate: "2025-06-14",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 443,
    },
    {
        guestName: "Prof. Michael Nagler",
        guestTitle: "Professor of Economics",
        guestInstitution: "Lehman College, CUNY",
        thumbnailImage: "/uploads/prof-michael-nagler.jpg",
        scheduledDate: "2025-06-18",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 444,
    },
    {
        guestName: "Prof. Michael Useem",
        guestTitle: "Professor of Management",
        guestInstitution: "The Wharton School",
        thumbnailImage: "/uploads/prof-michael-useem.jpg",
        scheduledDate: "2025-06-21",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 445,
    },
    {
        guestName: "Prof. Ravi Bapna & Prof. Anindya Ghose",
        guestTitle: "Professors of Information Systems",
        guestInstitution: "University of Minnesota & NYU Stern",
        thumbnailImage: "/uploads/prof-ravi-bapna-prof-anindya-ghose.jpg",
        scheduledDate: "2025-06-25",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 446,
    },
    {
        guestName: "Prof. Robin Landa, MFA",
        guestTitle: "Distinguished Professor",
        guestInstitution: "Kean University",
        thumbnailImage: "/uploads/prof-robin-landa-mfa.jpg",
        scheduledDate: "2025-06-28",
        scheduledTime: "10:00 PM IST",
        episodeNumber: 447,
    },
];

async function addAllUpcomingPodcasts() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(config.mongodb.uri);
        console.log('Connected to MongoDB');

        // First, remove old placeholder upcoming podcasts (those without proper guest info)
        console.log('\nRemoving old placeholder upcoming podcasts...');
        const oldUpcoming = await Podcast.find({
            category: 'upcoming',
            $or: [
                { guestName: 'To Be Announced' },
                { guestName: { $regex: /^To Be Announced/i } },
                { title: { $regex: /Guest TBA/i } }
            ]
        });

        if (oldUpcoming.length > 0) {
            for (const podcast of oldUpcoming) {
                await Podcast.deleteOne({ _id: podcast._id });
                console.log('  Deleted:', podcast.title);
            }
            console.log('Deleted', oldUpcoming.length, 'old placeholder podcasts');
        } else {
            console.log('  No old placeholders found');
        }

        // Add new upcoming podcasts
        console.log('\nAdding', upcomingPodcasts.length, 'upcoming podcasts...');

        let added = 0;
        let updated = 0;
        let skipped = 0;

        for (const podcast of upcomingPodcasts) {
            // Check if podcast already exists by guest name
            const existing = await Podcast.findOne({
                $or: [
                    { guestName: podcast.guestName },
                    { episodeNumber: podcast.episodeNumber }
                ]
            });

            const podcastData = {
                title: `Business Talk with ${podcast.guestName}`,
                description: `Join Dr. Deepak Bhatt for an insightful conversation with ${podcast.guestName}, ${podcast.guestTitle} at ${podcast.guestInstitution}.`,
                guestName: podcast.guestName,
                guestTitle: podcast.guestTitle,
                guestInstitution: podcast.guestInstitution,
                guestImage: podcast.thumbnailImage,
                thumbnailImage: podcast.thumbnailImage,
                category: 'upcoming' as const,
                scheduledDate: new Date(podcast.scheduledDate),
                scheduledTime: podcast.scheduledTime,
                youtubeUrl: '',  // No YouTube URL for upcoming episodes
                episodeNumber: podcast.episodeNumber,
                tags: ['Business', 'Interview', 'Academic'],
                isRescheduled: false,
            };

            if (existing) {
                // Update existing podcast
                await Podcast.updateOne({ _id: existing._id }, podcastData);
                console.log('  Updated:', podcast.guestName);
                updated++;
            } else {
                // Create new podcast
                await Podcast.create(podcastData);
                console.log('  Added:', podcast.guestName);
                added++;
            }
        }

        // Summary
        console.log('\n============================================================');
        console.log('SUMMARY');
        console.log('============================================================');
        console.log('Added:', added);
        console.log('Updated:', updated);
        console.log('Skipped:', skipped);

        // Final stats
        const upcomingCount = await Podcast.countDocuments({ category: 'upcoming' });
        const pastCount = await Podcast.countDocuments({ category: 'past' });
        console.log('\nDatabase Stats:');
        console.log('  Upcoming podcasts:', upcomingCount);
        console.log('  Past podcasts:', pastCount);
        console.log('  Total:', upcomingCount + pastCount);

        // List first 10 upcoming podcasts to verify
        console.log('\nFirst 10 upcoming podcasts:');
        const sample = await Podcast.find({ category: 'upcoming' })
            .sort({ scheduledDate: 1 })
            .limit(10);
        sample.forEach(p => {
            console.log('  -', p.guestName, '-', p.scheduledDate?.toISOString().split('T')[0]);
        });

    } catch (error) {
        console.error('Failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

addAllUpcomingPodcasts();

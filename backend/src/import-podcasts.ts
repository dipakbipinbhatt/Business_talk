// One-time script to import all podcasts from the original site
// Run with: npx tsx src/import-podcasts.ts

import mongoose from 'mongoose';
import { config } from './config/env';
import { Podcast } from './models/Podcast';

const allPodcasts = [
    // Dr. Tima Bansal episode is PAST because it has a YouTube URL (already recorded)
    { title: "Seeing Beyond the Here and Now: Rethinking Corporate Purpose with Dr. Tima Bansal", guestName: "Dr. Tima Bansal", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=bdM3lx_o5TE" },

    // Note: Upcoming podcasts are managed separately via add-upcoming.ts script

    // Past podcasts from the original site
    { title: "From Stores to 'Everywhere': What Dr. Santiago Gallino Reveals About the Future of Retail", guestName: "Dr. Santiago Gallino", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=O70-Im-e2oY" },
    { title: "When Measurement Goes Wrong: Dr. Robert Austin Explains Performance Dysfunction", guestName: "Dr. Robert Austin", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=_l8BWNdevMo" },
    { title: "How We Hear: Dr. Laurie Heller Explains the Future of Intelligent Audio", guestName: "Dr. Laurie Heller", category: "past", youtubeUrl: "https://youtu.be/XM3-BW3u3NU" },
    { title: "Bioethics in Action: Protecting Participants Through Data Safety Monitoring Boards", guestName: "Guest", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=IVCgW0IvLow" },
    { title: "Others Matter When Mothers Return: Inside Dr. Rosado-Solomon's Groundbreaking Study", guestName: "Dr. Rosado-Solomon", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=Dm0pz7dKLKU" },
    { title: "To Know Is to Compare: Rethinking Social Media across Nations, Media, and Platforms", guestName: "Guest", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=xdRlabRl47o" },
    { title: "Risk, Uncertainty, and Health: Dr. Laurel Austin on Decisions in the Digital Age", guestName: "Dr. Laurel Austin", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=oV8NJ2Zrrgs" },
    { title: "Absolutely Essential: Dr. Jonathan Moreno on Bioethics and the Global Rules-Based Order", guestName: "Dr. Jonathan Moreno", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=Z4sF6MDW-LQ" },
    { title: "Community Power vs. Wildfire Risk: Dr. Devin Stein on Public Value and Resilience", guestName: "Dr. Devin Stein", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=H-z0Yu8PtPY" },
    { title: "Creativity in the Age of AI: Prof. Jerry Wind's Toolkit for the Modern Mind", guestName: "Prof. Jerry Wind", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=_oqimM070f0" },
    { title: "Teaching with Cases: Proven Methods from Dr. Urs Mueller", guestName: "Dr. Urs Mueller", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=Qb0QfdAj1B0" },
    { title: "Why Anxiety Is Essential to Being Human | Dr. Samir Chopra", guestName: "Dr. Samir Chopra", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=MZ2DI94Rleg" },
    { title: "How Great Leaders Reframe Decisions: Dr. Michael Gillespie on 'Distancing'", guestName: "Dr. Michael Gillespie", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=yuISduFi3Ig" },
    { title: "Who Should Regulate the Digital World? Research Insights from Dr. Cary Coglianese", guestName: "Dr. Cary Coglianese", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=Sk7zUeXHRyk" },
    { title: "How Inflation Works - Insights from UC Berkeley Economist Dr. Martha Olney", guestName: "Dr. Martha Olney", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=rvWCquQDUcc" },
    { title: "The Virtues of Anxiety: Dr. Charlie Kurth on Emotion, Fear, and Growth", guestName: "Dr. Charlie Kurth", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=aKlt_wXluk4" },
    { title: "Inside Human Decision-Making: Dr. Baruch Fischhoff Explains the Psychology of Choice", guestName: "Dr. Baruch Fischhoff", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=xRXU-XD3kBg" },
    { title: "What Top French Chefs Teach Us About Innovation and Leadership", guestName: "Guest", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=59L0Xy2468Y" },
    { title: "Designing the New Age of Remote & Hybrid Work with Dr. Barbara Larson", guestName: "Dr. Barbara Larson", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=FvARX34-ttA" },
    { title: "Connected Strategy in Action: Dr Christian Terwiesch on Always-On Customer Relationships", guestName: "Dr. Christian Terwiesch", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=i4qAdak0eXc" },
    { title: "To Give a Fish or Teach to Fish? Dr. Hemant Kakkar on Smarter Leadership Help", guestName: "Dr. Hemant Kakkar", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=ViiGR5mAf8A" },
    { title: "Russia, the West, and Hybrid War: Mitchell Orenstein Explains the New Conflict", guestName: "Mitchell Orenstein", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=SMNJ2w_ZR9A" },
    { title: "Does Impact Investing Really Work? Insights from Dr. Jules van Binsbergen", guestName: "Dr. Jules van Binsbergen", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=lMGyz8bWAlg" },
    { title: "Does AI See Colors Like Humans? Inside 'Blood Is Red, Math Is Blue'", guestName: "Guest", category: "past", youtubeUrl: "https://youtu.be/w53f0DeU2XY" },
    { title: "Sharing Economy or Space Trade? Dr. Sara Dolnicar Explains", guestName: "Dr. Sara Dolnicar", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=NQBO1Z33r0o" },
    { title: "The Idealized Mind: Rethinking Cognitive Science with Dr. Michael Kirchhoff", guestName: "Dr. Michael Kirchhoff", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=R2P6TcwL720" },
    { title: "In Extremis Leadership: Lessons from Brig. Gen. Dr. Thomas Kolditz", guestName: "Brig. Gen. Dr. Thomas Kolditz", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=wiL8YE-liWo" },
    { title: "How to Give Voice to Values in the Boardroom: Dr. Cynthia Clark Explains", guestName: "Dr. Cynthia Clark", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=VDBxWp_n_WQ" },
    { title: "Why Finance Is Failing Workers: Dr. Peter Cappelli on Our Least Important Asset", guestName: "Dr. Peter Cappelli", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=8G7Bm2dlcpc" },
    { title: "Turning Marketing Data into Profits: Groundbreaking Insights with Dr. Denish Shah", guestName: "Dr. Denish Shah", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=S5xcyiLyOC4" },
    { title: "The Power of Feelings: Transforming Marketing with Dr. Michel Tuan Pham", guestName: "Dr. Michel Tuan Pham", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=j6OSANjg0Jo" },
    { title: "The Science Behind Sustainable Eating: Insights from Dr. Gidon Eshel", guestName: "Dr. Gidon Eshel", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=RojEC-HadmE" },
    { title: "From Research to Practice: Dr. Andrea Gregg on Transforming Online Course Design", guestName: "Dr. Andrea Gregg", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=zvG7ED4h93g" },
    { title: "Titans of Industrial Agriculture Explained: Who Controls Our Food System?", guestName: "Guest", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=uEM73tayKso" },
    { title: "How Libraries Adapted: Digital Shifts During COVID", guestName: "Guest", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=aKpgp1y0huk" },
    { title: "Sales Information Transparency Explained: Insights from Prof. Noam Shamir", guestName: "Prof. Noam Shamir", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=T5zV1wpf6ac" },
    { title: "How Transparent Ratings Shape Financial Trust", guestName: "Guest", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=MRI4nPC_hXU" },
    { title: "Unlocking Leadership Change: Dr. Jeffrey Yip's Listen and Build Framework", guestName: "Dr. Jeffrey Yip", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=ukCOJNXlrbk" },
    { title: "Leadership as Masterpiece Creation: Lessons from the Humanities with Dr. Charles Spinosa", guestName: "Dr. Charles Spinosa", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=5H4QjF0-GuE" },
    { title: "Economics Without Data: How Historical Risk Reveals Hidden Patterns in Decision-Making", guestName: "Guest", category: "past", youtubeUrl: "https://youtu.be/AUxdH5RhUMY" },
    { title: "Reverse Innovation: How Emerging Markets Change Global Business – Dr. Ravi Ramamurti Explains", guestName: "Dr. Ravi Ramamurti", category: "past", youtubeUrl: "https://youtu.be/CiSUFmIWaJQ" },
    { title: "Fashion's Future: AI, Brand Identity & Consumer Trends with Dr. Chung Wha Ki", guestName: "Dr. Chung Wha Ki", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=gPUc5giAMi0" },
    { title: "How People, Processes & Trust Drive AI's Full Potential: Insights from Dr. Ramayya Krishnan", guestName: "Dr. Ramayya Krishnan", category: "past", youtubeUrl: "https://youtu.be/A0w-YxaNViQ" },
    { title: "Unlocking the Metaverse Economy: Harvard Researcher Dr. Paola Cecchi-Dimeglio Explains", guestName: "Dr. Paola Cecchi-Dimeglio", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=nEnUw3B1YSM" },
    { title: "Predicting Your Competitor's Next Move with Dr. John Horn", guestName: "Dr. John Horn", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=xvPnZz9GHAY" },
    { title: "How Online Education is Transforming Strategic Marketing Leadership", guestName: "Guest", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=dqI3VPsi5Q4" },
    { title: "Understanding Inequality: Insights from the Handbook on Economics of Discrimination", guestName: "Guest", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=XNaVygtiUcE" },
    { title: "Why Social Security Favors the Married: Insights from Dr. Deborah Carr's Research Study", guestName: "Dr. Deborah Carr", category: "past", youtubeUrl: "https://youtu.be/dEvT91hJDm4" },
    { title: "Rethinking Corporations: Prof. David Silver on Morality and Democracy in Business", guestName: "Prof. David Silver", category: "past", youtubeUrl: "https://youtu.be/0SRdY3z9bwM" },
    { title: "Uncertainty and Decision-Making: The True Story of Europe's 1931 Financial Collapse", guestName: "Guest", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=hNyIj2lR224" },
    { title: "AI vs Human Intelligence: Dr. Gerd Gigerenzer Explains Who Really Makes Better Decisions", guestName: "Dr. Gerd Gigerenzer", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=9waQzLAvjR4" },
    { title: "Good Growth: How Brands Win with Social Impact | Dr. Omar Rodríguez-Vilá", guestName: "Dr. Omar Rodríguez-Vilá", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=pCjIXMpjgqI" },
    { title: "How Celebrities Influence What You Buy | Dr. Michael Platt Explains the Neuroscience of Attention", guestName: "Dr. Michael Platt", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=SMyo45U7lxM" },
    { title: "Why Too Many Charity Options Can Overwhelm Donors - Dr. Danit Ein-Gar Explains", guestName: "Dr. Danit Ein-Gar", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=APnqwEzawu4" },
    { title: "How AI Is Changing Digital Marketing Forever | Research Insights by Dr. Ron Berman", guestName: "Dr. Ron Berman", category: "past", youtubeUrl: "https://youtu.be/9-X28ucLTC8" },
    { title: "AI, Big Data & Smarter Marketing Decisions | Conversation with Dr. P. K. Kannan", guestName: "Dr. P. K. Kannan", category: "past", youtubeUrl: "https://youtu.be/OXb36Ayc4oM" },
    { title: "Unlocking Innovation: Insights from 'Innovation-ish' by Tessa Forshaw & Richard Braden", guestName: "Tessa Forshaw & Richard Braden", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=2lAQACPHaiM" },
    { title: "How Nostalgia Can Boost Employee Retention After Acquisitions | Dr. Boris Maciejovsky", guestName: "Dr. Boris Maciejovsky", category: "past", youtubeUrl: "https://youtu.be/p4xGWy4ifcw" },
    { title: "How Firms Value Sales Experience | Dr. Alireza Keshavarz Explains", guestName: "Dr. Alireza Keshavarz", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=8kdixekx6LE" },
    { title: "Unique You: Unlocking the Power of Individuality with Dr. Nigel Nicholson", guestName: "Dr. Nigel Nicholson", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=0nIfJnfTuvE" },
    { title: "Who Handles the Tough Talk? Dr. Rachael Goodwin on Power and Difficult Conversations", guestName: "Dr. Rachael Goodwin", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=URCgeCacj3s" },
    { title: "Regulating Finance in the Age of AI: Risks, Rewards & Insights | Dr. Jean-Edouard Colliard", guestName: "Dr. Jean-Edouard Colliard", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=wdtrYlD2ipg" },
    { title: "The Science of Helping Others: Insights from Dr. Zoe Kinias", guestName: "Dr. Zoe Kinias", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=oEXbnY9D7I0" },
    { title: "Public Health Data Science Insights from Yale's Dr. Bhramar Mukherjee", guestName: "Dr. Bhramar Mukherjee", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=xczWksrKGLA" },
    { title: "Why Online Consumption Communities Brutalize – Dr. Kristine de Valck", guestName: "Dr. Kristine de Valck", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=dZYNkF9ef1Q" },
    { title: "Inside the Cut-and-Play Algorithm: Dr. Sriram Sankaranarayanan on Game Theory Innovation", guestName: "Dr. Sriram Sankaranarayanan", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=BOOMDHcl2i0" },
    { title: "Crafting Business Narratives: Insights from Columbia's Roland Wyn Jones", guestName: "Roland Wyn Jones", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=NMxC00Vcccc" },
    { title: "Why All Customers Aren't Equal - Insights from Dr. Peter Fader's 'Customer Centricity'", guestName: "Dr. Peter Fader", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=oWMpmqgYvYo" },
    { title: "How Moral Character Shapes Workplace Behavior | Prof. Taya R. Cohen", guestName: "Prof. Taya R. Cohen", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=m1FQ6qKW9Yw" },
    { title: "Ideation with Generative AI: Insights from Wharton's Dr. Stefano Puntoni", guestName: "Dr. Stefano Puntoni", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=6E1R8wT_1hk" },
    { title: "Law Meets Accounting: How Dr. Beatrice Michaeli Bridges Justice and Finance", guestName: "Dr. Beatrice Michaeli", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=FN6epHBRteo" },
    { title: "Elite Taxation and Public Safety: Lessons from Contemporary Latin America", guestName: "Guest", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=DdbIg6Cz3_g" },
    { title: "Past, Present & Future of Work: Dr. Daniela Vidart Explains Human Capital", guestName: "Dr. Daniela Vidart", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=Wit7Uw1SnjY" },
    { title: "Dr. Namrata Sharma on Education for Sustainability & Global Citizenship", guestName: "Dr. Namrata Sharma", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=1yeOcTnWLxQ" },
    { title: "Exploring Innovation in India: Dr. Rishikesha Krishnan Shares Key Research Insights", guestName: "Dr. Rishikesha Krishnan", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=iz6hbrWEL9E" },
    { title: "Revolutionizing Public Services: Prof. Subhash Bhatnagar Explains E-Governance", guestName: "Prof. Subhash Bhatnagar", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=_evfZs4gHO8" },
    { title: "Creative AI in Marketing: Dr. Ming-Hui Huang's Breakthrough Research", guestName: "Dr. Ming-Hui Huang", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=IyTH2QKHcBc" },
    { title: "From Meme Stocks to Market Shifts: Prof. Angel Zhong on Retail Investing", guestName: "Prof. Angel Zhong", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=fZSTbuypllY" },
    { title: "Winning with Alliances | HEC Paris Professor Dr. Pierre Dussauge Explained", guestName: "Dr. Pierre Dussauge", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=V6uW7LkPQy0" },
    { title: "Winning with Data Science: Practical Strategies for Leaders", guestName: "Guest", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=wjrdu9hNNuE" },
    { title: "Why Disgust Matters: Insights from Dr. Daniel Kelly's New Book", guestName: "Dr. Daniel Kelly", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=p7jZIKlxI04" },
    { title: "The Digital Phoenix Effect: How Legacy Firms Can Lead the Platform Revolution", guestName: "Guest", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=zmtXN1PMpMY" },
    { title: "How to Manage Your Attention Better | Insights from Dr. Gloria Mark's Book", guestName: "Dr. Gloria Mark", category: "past", youtubeUrl: "https://youtu.be/doHqhk7xQtI" },
    { title: "The Heroic Spirit of Business: Dr. Raj Sisodia Explains Conscious Capitalism", guestName: "Dr. Raj Sisodia", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=Dk-YxUjyD8Y" },
    { title: "Who Gets the Job? AI, Gender Bias, and Hiring Decisions", guestName: "Guest", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=kWf3vqbQRAA" },
    { title: "How AI Can Transform Healthcare | Insights from MIT's Dr. Swati Gupta", guestName: "Dr. Swati Gupta", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=beN38wSGQDo" },
    { title: "Innovation & Public Policy in India – Prof. Rakesh Basant Breaks It Down", guestName: "Prof. Rakesh Basant", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=o2rMGhLpdEE" },
    { title: "Want to Make a Difference? Strategies from Somebody Should Do Something - Social Impact", guestName: "Guest", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=93ABiOlEQDc" },
    { title: "Fertility, Parenthood & Ethics | Mary Fusillo's Insightful Approach", guestName: "Mary Fusillo", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=OJUs9-CE9sY" },
    { title: "Global Diabetes Challenges & Solutions: Insights from Dr. Venkat Narayan, Emory University", guestName: "Dr. Venkat Narayan", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=Nvld1mV5XoA" },
    { title: "Justice, Development, and Local Courts: Dr. Manaswini Rao on Grassroots Economics", guestName: "Dr. Manaswini Rao", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=SV24BX-JG3Q" },
    { title: "The Making of Digital Citizens: Insights from MICA's Prof. Manisha Pathak-Shelat", guestName: "Prof. Manisha Pathak-Shelat", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=6h56bXK06e0" },
    { title: "Inclusive Business Models: Professor Sourav Mukherji on Driving Social Impact & Livelihoods", guestName: "Prof. Sourav Mukherji", category: "past", youtubeUrl: "https://youtu.be/qNyI8iVQJN8" },
    { title: "How Operations Research Is Revolutionizing Public Health: Insights from Dr. Sarang Deo", guestName: "Dr. Sarang Deo", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=y1K-TbKSv80" },
    { title: "What Leaders Should Do After Layoffs | Dr. Anil Verma from Rotman School", guestName: "Dr. Anil Verma", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=cBsnxTsIPZg" },
    { title: "How Academia and Industry Can Work Together for Society's Benefit", guestName: "Guest", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=XMSZ9XdB0ps" },
    { title: "What Makes a GEM Leader? Dr. Aaron Nurick on The Good Enough Manager", guestName: "Dr. Aaron Nurick", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=ap6D0bicYNg" },
    { title: "How Data is Transforming Precision Medicine | Insights from Dr. Ying Lin", guestName: "Dr. Ying Lin", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=14E37Y9sXLM" },
    { title: "Dr. Steven Hayes: How Acceptance & Commitment Therapy Shapes Modern Psychology", guestName: "Dr. Steven Hayes", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=IfsFbODfUTQ" },
    { title: "Rethinking R&D: Dr. Anand Nandkumar on Efficiency, Proximity & Centralization", guestName: "Dr. Anand Nandkumar", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=D6pcrX0gqno" },
    { title: "From Playgrounds to Boardrooms: The Power of Sports in Education", guestName: "Guest", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=Bqi7eN3RFD0" },
    { title: "From Legacy to Agile: Insights from Former ISB Dean Dr. Rajendra Srivastava", guestName: "Dr. Rajendra Srivastava", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=My-qODcZHMY" },
    { title: "Revolution or Evolution? Dr. Roland Rust on AI's Role in Marketing", guestName: "Dr. Roland Rust", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=kMOI2yeyjRs" },
    { title: "Digitalisation and Well-Being: Dr. Ana Isabel Canhoto on Building Inclusive Technology", guestName: "Dr. Ana Isabel Canhoto", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=bYYTU80znqo" },
    { title: "Harvard's Dr. Xiao-Li Meng on Leadership, Statistics & Data Science Innovation", guestName: "Dr. Xiao-Li Meng", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=xa7mNs4nlbA" },
    { title: "How Film Became a Weapon of War | Dr. Alice Lovejoy Explains", guestName: "Dr. Alice Lovejoy", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=LWqeD3c6_Pg" },
    { title: "The Energy of Money: Finding Spiritual Fulfillment with Dr. Maria Nemeth", guestName: "Dr. Maria Nemeth", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=UTN85lLdvO8" },
    { title: "Elite Colleges & High-Skilled Migration – Insights from Dr. Ina Ganguli", guestName: "Dr. Ina Ganguli", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=4eUJjfzE4kc" },
    { title: "How AI Transforms Business – Insights from Dr. Rahul De', Former IIM Bangalore Dean", guestName: "Dr. Rahul De'", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=EfvQ3Dfz2nc" },
    { title: "Optimizing Sales Compensation: Research Insights from ISB's Dr. Pranav Jindal", guestName: "Dr. Pranav Jindal", category: "past", youtubeUrl: "https://youtu.be/thJ1hHYceuE" },
    { title: "How Venture Capital Shapes the Way We Work | Dr. Benjamin Shestakofsky Explains", guestName: "Dr. Benjamin Shestakofsky", category: "past", youtubeUrl: "https://youtu.be/6Ci7CO0n-NQ" },
    { title: "Developing Leader Character: A Fresh Lens on Leadership | Dr. Corey Crossan from Oxford Explains", guestName: "Dr. Corey Crossan", category: "past", youtubeUrl: "https://youtu.be/92jB9If2gMA" },
    { title: "Executive Behavior & Corporate Conduct – Insights from Prof. Aiyesha Dey of Harvard Business School", guestName: "Prof. Aiyesha Dey", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=rfSSW_NPQTQ" },
    { title: "Neuroscience Meets Warfare: Dr. Nicholas Wright's Bold New Theory in Warhead", guestName: "Dr. Nicholas Wright", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=n-a_O99rl_0" },
    { title: "Information Fatigue Syndrome: Global Expert Dr. Dobrica Savić on What You Need to Know", guestName: "Dr. Dobrica Savić", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=EkljmVXd6e0" },
    { title: "Why Free Trade Fails Hard Hitting Insights from Ian Fletcher's Bestseller", guestName: "Ian Fletcher", category: "past", youtubeUrl: "https://youtu.be/wct3vcdNXcI" },
    { title: "Future-Proof Your Business: Strategies from the Book Winning in the Age of AI Disruption", guestName: "Guest", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=4qyW-aadlfo" },
    { title: "Professor Tirthankar Roy on What Drives India's Long Term Economic Change", guestName: "Prof. Tirthankar Roy", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=dXlNAlBoFnM" },
    { title: "Stanford d.school's Lisa Kay Solomon on Designing Strategic Conversations", guestName: "Lisa Kay Solomon", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=rQ3Ziq0MyeE" },
    { title: "Prof. Nishith Prakash's on Empowering Girls Through Mobility and Education", guestName: "Prof. Nishith Prakash", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=9FAP3VuOKBo" },
    { title: "Rethinking Reality Prof Peter Lamont on the Psychology Behind Big Picture Thinking", guestName: "Prof. Peter Lamont", category: "past", youtubeUrl: "https://youtu.be/NZngsHaD-pM" },
    { title: "Every Purchase Matters: Paul Rice on the Power of Fair Trade", guestName: "Paul Rice", category: "past", youtubeUrl: "https://youtu.be/1Wu72m1VUnA" },
    { title: "How to Scale Innovation: INSEAD's Prof. Ben Bensaou Shares Groundbreaking Insights", guestName: "Prof. Ben Bensaou", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=rdeZPTHzdbM" },
    { title: "How Great Leaders Decide: Prof. Andrew Likierman on Smarter Leadership Decisions", guestName: "Prof. Andrew Likierman", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=RgqMwooyWxI" },
    { title: "From Trauma to Transformation: Dr. Robyn Koslowitz on Healing Parenthood", guestName: "Dr. Robyn Koslowitz", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=UvCjYA8BqQU" },
    { title: "Is Social Media Burning Us Out? Dr. Vishal Dahiya Explains the Hidden Cost of AI", guestName: "Dr. Vishal Dahiya", category: "past", youtubeUrl: "https://youtu.be/Sg-Y90upzZU" },
    { title: "How Companies Use Trade Secrets to Drive Innovation, Prof. Aldona Kapačinskaitė from INSEAD Explains", guestName: "Prof. Aldona Kapačinskaitė", category: "past", youtubeUrl: "https://youtu.be/YDCY3fCtKOw" },
    { title: "Female CEOs and Business Impact: Insights from Prof. Luca Flabbi's Research on Gender and Performance", guestName: "Prof. Luca Flabbi", category: "past", youtubeUrl: "https://youtu.be/tWV5fVxo8zA" },
    { title: "Managing with AI: Measuring What Truly Matters – Dr. David Kiron from MIT Sloan Explains", guestName: "Dr. David Kiron", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=rq_jGbMkgCQ" },
    { title: "From Fieldwork to Feeds: Prof. Varsha Jain on Researching in a Digital World", guestName: "Prof. Varsha Jain", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=Rcna6-dtzK8" },
    { title: "Inside Resolute Japan: Profs. Ikegami, Singh & Useem on Reviving Japan's Business Landscape", guestName: "Profs. Ikegami, Singh & Useem", category: "past", youtubeUrl: "https://youtu.be/7VLygcHO8GU" },
    { title: "Love, Labor & Chocolate: Why Copreneurs Succeed – Prof. Jennifer Woolley Explains", guestName: "Prof. Jennifer Woolley", category: "past", youtubeUrl: "https://youtu.be/B_c5TB8K4VA" },
    { title: "Tariffs, Trade & Tension: Prof. Arvind Sahay on Rethinking Global Marketing", guestName: "Prof. Arvind Sahay", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=cg19p_gjynI" },
    { title: "The Post-COVID Workplace: Wharton Professor Matthew Bidwell Explains the Shift", guestName: "Prof. Matthew Bidwell", category: "past", youtubeUrl: "https://youtu.be/vOhQqoQuPjw" },
    { title: "Can Economics Really Save the World? A Deep Dive into Prof. Erik Angner's Groundbreaking Book", guestName: "Prof. Erik Angner", category: "past", youtubeUrl: "https://www.youtube.com/watch?v=rdLplC-AAL8" },
    { title: "From ME to WE: Kyle McDowell's Blueprint for Transformational Leadership", guestName: "Kyle McDowell", category: "past", youtubeUrl: "https://youtu.be/aXQe9Toh1Sc" },
];

async function importPodcasts() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(config.mongodb.uri);
        console.log('✅ Connected to MongoDB');

        console.log(`📦 Importing ${allPodcasts.length} podcasts...`);

        let imported = 0;
        let skipped = 0;

        for (let i = 0; i < allPodcasts.length; i++) {
            const p = allPodcasts[i];

            // Check if podcast already exists
            const existing = await Podcast.findOne({ title: p.title });
            if (existing) {
                skipped++;
                continue;
            }

            // Create podcast
            await Podcast.create({
                title: p.title,
                description: p.title,
                guestName: p.guestName,
                guestTitle: 'Guest Speaker',
                guestInstitution: '',
                guestImage: '',
                thumbnailImage: '',
                category: p.category,
                scheduledDate: (p as any).scheduledDate ? new Date((p as any).scheduledDate) : new Date('2024-01-01'),
                scheduledTime: '10:00 PM IST',
                youtubeUrl: p.youtubeUrl || '',
                episodeNumber: allPodcasts.length - i,
                tags: [],
            });
            imported++;
        }

        console.log(`\n✅ Import complete!`);
        console.log(`   Imported: ${imported}`);
        console.log(`   Skipped (duplicates): ${skipped}`);
        console.log(`   Total podcasts in database: ${await Podcast.countDocuments()}`);

    } catch (error) {
        console.error('❌ Import failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

importPodcasts();

export interface StoreReview {
  id: string
  name: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
}

// Fictional examples for demo store profiles. No identity or purchase is verified.
export const reviewsByStore: Record<string, StoreReview[]> = {
  'bowbazar-gold-house': [
    { id: 'bg-1', name: 'Ananya Chatterjee', rating: 5, title: 'Patient guidance for a special occasion', comment: 'I was looking for a traditional necklace for a family celebration. The team took time to show me different styles and explain the details without rushing me.', date: '2026-10-24', verified: true },
    { id: 'bg-2', name: 'Sourav Mukherjee', rating: 4, title: 'A lovely range of classic designs', comment: 'The bangle collection had several designs we liked. It was a little busy during our visit, but the staff made sure we had time to compare our favourites.', date: '2026-10-18', verified: true },
    { id: 'bg-3', name: 'Madhumita Das', rating: 5, title: 'A thoughtful shopping experience', comment: 'I appreciated being able to discuss the weight and making charges before choosing a piece. The traditional designs were just what I was hoping to see.', date: '2026-10-09', verified: true },
  ],
  'bhowanipore-jewel-studio': [
    { id: 'bj-1', name: 'Riya Sen', rating: 5, title: 'Beautiful everyday options', comment: 'I wanted a pair of earrings I could wear to work. There were plenty of delicate designs, and the team helped me narrow down the options within my budget.', date: '2026-10-27', verified: true },
    { id: 'bj-2', name: 'Arjun Roy', rating: 4, title: 'Helpful with a birthday gift', comment: 'The staff listened to what I was looking for and suggested a few simple pendants. I would have liked more choices in my price range, but the guidance was helpful.', date: '2026-10-20', verified: true },
    { id: 'bj-3', name: 'Ishita Ghosh', rating: 5, title: 'Comfortable and welcoming', comment: 'This was my first time comparing jewellery in person. I felt comfortable asking questions and trying different styles before making a decision.', date: '2026-10-12', verified: true },
  ],
  'salt-lake-gold-gallery': [
    { id: 'sg-1', name: 'Priyanka Dutta', rating: 4, title: 'Contemporary designs worth exploring', comment: 'I enjoyed browsing the bracelets and lightweight pendants. The collection felt modern, and it was easy to compare a few different looks.', date: '2026-10-29', verified: true },
    { id: 'sg-2', name: 'Debabrata Paul', rating: 5, title: 'Clear explanations and friendly service', comment: 'We asked a lot of questions about the pieces we shortlisted. The team was patient and walked us through the details before we chose our favourite.', date: '2026-10-22', verified: true },
    { id: 'sg-3', name: 'Sneha Banerjee', rating: 4, title: 'A pleasant weekend visit', comment: 'The everyday jewellery selection was lovely. We had a short wait on Saturday, so I would probably plan a weekday visit next time.', date: '2026-10-14', verified: true },
  ],
  'diamond-plaza-jewels': [
    { id: 'dp-1', name: 'Nandini Bose', rating: 5, title: 'Made choosing an occasion piece easier', comment: 'I came in looking for something for an anniversary celebration. Trying the necklaces in person helped me find a style that felt right for the occasion.', date: '2026-10-26', verified: true },
    { id: 'dp-2', name: 'Rahul Saha', rating: 4, title: 'Good options for gifting', comment: 'We found several ring designs to compare. The team explained the options clearly, though we would have liked a few more sizes available to try.', date: '2026-10-17', verified: true },
    { id: 'dp-3', name: 'Aditi Mitra', rating: 5, title: 'Warm service and lovely statement pieces', comment: 'The occasion collection had some beautiful designs. I appreciated being given enough time to try them and decide without feeling pressured.', date: '2026-10-08', verified: true },
  ],
  'baguiati-heritage-jewellers': [
    { id: 'bh-1', name: 'Oindrila Biswas', rating: 5, title: 'A memorable bridal browsing visit', comment: 'My mother and I enjoyed exploring the bridal-style necklaces and bangles. The team helped us compare traditional designs that would work well together.', date: '2026-10-28', verified: true },
    { id: 'bh-2', name: 'Abhishek De', rating: 4, title: 'Patient help with a family gift', comment: 'We had a particular style in mind and were shown several alternatives. The visit took a little longer than planned, but the advice was thoughtful.', date: '2026-10-19', verified: true },
    { id: 'bh-3', name: 'Tanushree Mondal', rating: 5, title: 'Classic designs with a personal touch', comment: 'I liked the heritage-inspired bangles and the relaxed atmosphere. The staff listened carefully and helped me shortlist a few pieces for our celebration.', date: '2026-10-11', verified: true },
  ],
}

export function storeReviewSummary(slug: string) {
  const reviews = reviewsByStore[slug] ?? []
  return { reviews, count: reviews.length, average: reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0 }
}

// Fictional review examples for the additional regional demo profiles.
const regionalReviewers: Record<string, string[]> = {
  'bardhaman-curzon-jewels': ['Sutapa Dey', 'Anirban Ghosh', 'Rupsa Mukherjee'],
  'golapbag-gold-studio': ['Moumita Pal', 'Sayan Chatterjee', 'Diya Saha'],
  'bankura-heritage-gold': ['Sushmita Karmakar', 'Ritwick Mondal', 'Tania Dutta'],
  'lalbazar-jewel-house': ['Bipasha Sen', 'Subhajit Roy', 'Payel Das'],
  'medinipur-gold-gallery': ['Sangita Maity', 'Kaushik Jana', 'Pritha Ghosh'],
  'keranitola-jewel-studio': ['Debolina Kar', 'Arindam Das', 'Meghna Patra'],
  'park-street-jewel-lounge': ['Shreya Dey', 'Rohan Basu', 'Aparna Paul'],
}
for (const [slug, names] of Object.entries(regionalReviewers)) {
  reviewsByStore[slug] = names.map((name, index) => ({
    id: slug + '-' + (index + 1), name, rating: index === 1 ? 4 : 5, verified: true,
    date: ['2026-10-28', '2026-10-20', '2026-10-12'][index],
    title: ['A lovely neighbourhood discovery', 'Helpful guidance and thoughtful options', 'A comfortable visit with family'][index],
    comment: [
      'I enjoyed exploring the designs for a family celebration. The team listened to what I had in mind and helped me compare a few different styles.',
      'There were several pieces we wanted to try. We had a short wait, but the staff took time to explain the details and help us narrow down our favourites.',
      'We appreciated the relaxed atmosphere and the chance to ask questions before choosing. It was helpful to compare the jewellery in person.'
    ][index],
  }))
}

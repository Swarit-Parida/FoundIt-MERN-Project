
import { Link } from 'react-router-dom';
import { MapPin, CalendarDays, ArrowUpRight } from 'lucide-react';

const fallbackImages = [
  {
    keywords: ['water bottle', 'bottle', 'flask', 'thermos'],
    url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['backpack', 'schoolbag', 'rucksack', 'bag'],
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['headphones', 'headphone', 'earphones', 'earphone', 'earbuds', 'airpods'],
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['smartphone', 'mobile', 'iphone', 'phone'],
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['laptop', 'computer', 'macbook'],
    url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['keychain', 'keys', 'key'],
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['wallet', 'purse', 'card holder'],
    url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['notebook', 'textbook', 'book', 'diary'],
    url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['wristwatch', 'watch'],
    url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['umbrella'],
    url: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['sneakers', 'sneaker', 'footwear', 'shoes', 'shoe'],
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['sunglasses', 'spectacles', 'glasses'],
    url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['camera', 'dslr'],
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['charger', 'cable', 'adapter'],
    url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['jacket', 'hoodie', 'shirt', 'clothing', 'coat'],
    url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
  },
  {
    keywords: ['identity card', 'student card', 'id card', 'badge'],
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=900&q=80',
  },
];

const genericFallback =
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=900&q=80';

function getFallbackImage(item) {
  const text = [
    item?.title,
    item?.description,
    item?.category,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // Match specific item names before generic keywords.
  const match = fallbackImages.find(({ keywords }) =>
    keywords.some((keyword) => text.includes(keyword))
  );

  return match?.url || genericFallback;
}

export default function ItemCard({ item }) {
  const fallback = getFallbackImage(item);
  const itemId = item._id || item.id;

  return (
    <article className="item-card">
      <Link to={`/items/${itemId}`} className="item-image-wrap">
        <img
          src={item.imageUrl || fallback}
          alt={item.title || 'Lost or found item'}
          loading="lazy"
          onError={(event) => {
            const image = event.currentTarget;

            if (image.dataset.fallbackApplied === 'true') return;

            image.dataset.fallbackApplied = 'true';
            image.src = fallback;
          }}
        />

        {item.type && (
          <span
            className={`status-pill ${
              String(item.type).toLowerCase() === 'found'
                ? 'status-found'
                : 'status-lost'
            }`}
          >
            {item.type}
          </span>
        )}
      </Link>

      <div className="item-card-body">
        <div className="item-category">
          {item.category || 'Other'}
        </div>

        <Link to={`/items/${itemId}`} className="item-title">
          <span>{item.title || 'Untitled item'}</span>
          <ArrowUpRight size={18} />
        </Link>

        <p className="item-description">
          {item.description || 'No description provided.'}
        </p>

        <div className="item-meta">
          {item.location && (
            <span>
              <MapPin size={13} />
              {item.location}
            </span>
          )}

          {item.createdAt && (
            <span>
              <CalendarDays size={13} />
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="item-card-footer">
          <span className="posted-by">
            {item.user?.name ||
              item.owner?.name ||
              'Campus community'}
          </span>

          <Link to={`/items/${itemId}`} className="text-link">
            View item <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}

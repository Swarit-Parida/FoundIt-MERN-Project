
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  UserRound,
  CheckCircle2,
  Clock3,
  ShieldAlert,
  Send,
  Trash2,
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const fallbackImages = [
  {
    keywords: ['water bottle', 'bottle', 'flask', 'thermos'],
    url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['backpack', 'schoolbag', 'rucksack', 'bag'],
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['phone', 'mobile', 'smartphone', 'iphone'],
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['laptop', 'computer', 'macbook'],
    url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['headphone', 'earphone', 'earbud', 'airpod'],
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['keychain', 'keys', 'key'],
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['wallet', 'purse', 'card holder'],
    url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['book', 'notebook', 'textbook', 'diary'],
    url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['watch', 'wristwatch'],
    url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['umbrella'],
    url: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['shoe', 'shoes', 'sneaker', 'footwear'],
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['glasses', 'spectacles', 'sunglasses'],
    url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['camera', 'dslr'],
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['charger', 'cable', 'adapter'],
    url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['jacket', 'hoodie', 'shirt', 'clothing', 'coat'],
    url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['id card', 'identity card', 'student card', 'badge'],
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['tablet', 'ipad'],
    url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['mouse', 'computer mouse'],
    url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['pen', 'pencil', 'stationery'],
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['football', 'soccer ball'],
    url: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0b0c?auto=format&fit=crop&w=1200&q=80',
  },
];

const genericFallback =
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1200&q=80';

function getFallbackImage(item) {
  const searchableText = [
    item?.title,
    item?.description,
    item?.category,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const match = fallbackImages.find(({ keywords }) =>
    keywords.some((keyword) => searchableText.includes(keyword))
  );

  return match?.url || genericFallback;
}

export default function ItemDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claimMessage, setClaimMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [claimError, setClaimError] = useState('');

  const load = () =>
    api
      .get(`/items/${id}`)
      .then(({ data }) => setItem(data.item))
      .catch((e) =>
        setError(e.response?.data?.message || 'Could not load this listing.')
      )
      .finally(() => setLoading(false));

  useEffect(() => {
    setLoading(true);
    setError('');
    load();
  }, [id]);

  const claim = async (e) => {
    e.preventDefault();
    setBusy(true);
    setClaimError('');

    try {
      await api.post(`/items/${id}/claims`, { message: claimMessage });
      setClaimMessage('');
      await load();
    } catch (e) {
      setClaimError(e.response?.data?.message || 'Could not send claim.');
    } finally {
      setBusy(false);
    }
  };

  const action = async (claimId, status) => {
    setBusy(true);
    setClaimError('');

    try {
      await api.patch(`/items/${id}/claims/${claimId}`, { status });
      await load();
    } catch (e) {
      setClaimError(e.response?.data?.message || 'Could not update claim.');
    } finally {
      setBusy(false);
    }
  };

  const markReturned = async () => {
    setBusy(true);
    setClaimError('');

    try {
      await api.patch(`/items/${id}/status`, { status: 'RETURNED' });
      await load();
    } catch (e) {
      setClaimError(e.response?.data?.message || 'Could not update item.');
    } finally {
      setBusy(false);
    }
  };

  const deleteItem = async () => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;

    setBusy(true);
    setClaimError('');

    try {
      await api.delete(`/items/${id}`);
      navigate('/');
    } catch (e) {
      setClaimError(e.response?.data?.message || 'Could not delete listing.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="page-loader">Loading listing…</div>;
  }

  if (error || !item) {
    return (
      <section className="form-page">
        <div className="notice notice-error">
          {error || 'Listing not found.'}
        </div>
        <Link to="/" className="button button-primary">
          Back to listings
        </Link>
      </section>
    );
  }

  const isOwner = user && user.id === item.owner?._id;
  const myClaim = item.claims?.find(
    (c) => c.claimant?._id === user?.id
  );
  const activeClaims =
    item.claims?.filter((c) => c.status === 'PENDING') || [];

  const fallback = getFallbackImage(item);
  const imageUrl = item.imageUrl || fallback;

  return (
    <section className="details-page">
      <button className="back-link" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back to listings
      </button>

      <div className="details-layout">
        <div className="details-image">
          <img
            src={imageUrl}
            onError={(e) => {
              const image = e.currentTarget;

              if (image.dataset.fallbackApplied === 'true') return;

              image.dataset.fallbackApplied = 'true';
              image.src = fallback;
            }}
            alt={item.title || 'Lost or found item'}
          />

          <span
            className={`status-pill ${
              item.type === 'FOUND' ? 'status-found' : 'status-lost'
            }`}
          >
            {item.type === 'FOUND' ? 'Found item' : 'Lost item'}
          </span>
        </div>

        <div className="details-content">
          <div className="eyebrow eyebrow-dark">
            {item.category} · LISTING #{item._id.slice(-6).toUpperCase()}
          </div>

          <h1>{item.title}</h1>

          <div className="details-status">
            <span
              className={`state-label ${
                item.status === 'RETURNED' ? 'state-returned' : ''
              }`}
            >
              <CheckCircle2 size={15} />
              {item.status === 'RETURNED'
                ? 'Returned'
                : item.status === 'CLAIMED'
                  ? 'Claim approved'
                  : 'Open listing'}
            </span>

            <span className="posted-date">
              Posted{' '}
              {new Date(item.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <p className="details-description">{item.description}</p>

          <div className="details-facts">
            <div>
              <MapPin size={18} />
              <span>
                <small>Last seen / found at</small>
                <b>{item.location}</b>
              </span>
            </div>

            <div>
              <CalendarDays size={18} />
              <span>
                <small>
                  Date {item.type === 'LOST' ? 'lost' : 'found'}
                </small>
                <b>
                  {new Date(item.dateLostFound).toLocaleDateString(
                    undefined,
                    {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      timeZone: 'UTC',
                    }
                  )}
                </b>
              </span>
            </div>

            <div>
              <UserRound size={18} />
              <span>
                <small>Listed by</small>
                <b>{item.owner?.name || 'Campus member'}</b>
              </span>
            </div>
          </div>

          {claimError && (
            <div className="notice notice-error">{claimError}</div>
          )}

          {item.status !== 'RETURNED' &&
            !isOwner &&
            user &&
            item.type === 'FOUND' && (
              <div className="claim-panel">
                <h3>Think this belongs to you?</h3>
                <p>
                  Send the finder a claim request with details that help verify
                  ownership. Keep sensitive information private.
                </p>

                {myClaim ? (
                  <div className="claim-status">
                    <Clock3 size={17} /> Your claim is{' '}
                    <b>{myClaim.status.toLowerCase()}</b>
                    {myClaim.status === 'REJECTED'
                      ? ' — you can’t submit another claim for this listing.'
                      : ''}
                  </div>
                ) : (
                  <form onSubmit={claim}>
                    <label htmlFor="claimMessage">
                      Why do you believe this is yours?
                    </label>
                    <textarea
                      id="claimMessage"
                      rows="3"
                      minLength="10"
                      maxLength="500"
                      required
                      value={claimMessage}
                      onChange={(e) => setClaimMessage(e.target.value)}
                      placeholder="Describe a detail only the owner would know…"
                    />
                    <button
                      className="button button-primary"
                      disabled={busy}
                    >
                      <Send size={16} />
                      {busy ? 'Sending…' : 'Send claim request'}
                    </button>
                  </form>
                )}
              </div>
            )}

          {item.status !== 'RETURNED' &&
            !isOwner &&
            user &&
            item.type === 'LOST' && (
              <div className="claim-panel">
                <h3>Found this item?</h3>
                <p>
                  If you've found this item, create a found listing with its
                  current location so the owner can find it.
                </p>
                <Link to="/report" className="button button-primary">
                  Report a found item
                </Link>
              </div>
            )}

          {!user && item.status !== 'RETURNED' && (
            <div className="claim-panel">
              <h3>Help reunite this item</h3>
              <p>
                Sign in or create an account to send a claim request or report
                an item.
              </p>
              <Link to="/login" className="button button-primary">
                Log in to continue
              </Link>
            </div>
          )}

          {isOwner && (
            <div className="owner-panel">
              <div className="owner-panel-heading">
                <h3>Owner controls</h3>
                <span>
                  {activeClaims.length} pending claim
                  {activeClaims.length === 1 ? '' : 's'}
                </span>
              </div>

              {item.claims?.length ? (
                item.claims.map((c) => (
                  <div className="claim-row" key={c._id}>
                    <div className="claim-person">
                      <b>{c.claimant?.name || 'Campus member'}</b>
                      <small>{c.message}</small>
                      <span
                        className={`claim-tag claim-${c.status.toLowerCase()}`}
                      >
                        {c.status}
                      </span>
                    </div>

                    {c.status === 'PENDING' && (
                      <div className="claim-actions">
                        <button
                          className="button button-small button-primary"
                          disabled={busy}
                          onClick={() => action(c._id, 'APPROVED')}
                        >
                          Approve
                        </button>
                        <button
                          className="button button-small button-quiet"
                          disabled={busy}
                          onClick={() => action(c._id, 'REJECTED')}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="muted">
                  No claim requests yet. They'll appear here when someone
                  submits one.
                </p>
              )}

              {item.status !== 'RETURNED' && (
                <button
                  className="button button-dark full-width"
                  disabled={busy}
                  onClick={markReturned}
                >
                  <CheckCircle2 size={17} /> Mark item as returned
                </button>
              )}

              <button
                className="delete-listing"
                disabled={busy}
                onClick={deleteItem}
              >
                <Trash2 size={15} /> Delete listing
              </button>
            </div>
          )}

          <div className="safety-note">
            <ShieldAlert size={18} />
            <p>
              <b>Stay safe during handovers.</b> Meet in a busy public place on
              campus. Never share passwords, verification codes, or sensitive
              identity details.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

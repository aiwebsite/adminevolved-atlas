import React, { useEffect } from 'react';
import { useState } from 'react';
import { FaBars, FaSearch } from 'react-icons/fa';
import { NavigationMenu, SkipNavigationLink } from '@components';
import Link from 'next/link';
import className from 'classnames/bind';
import cookieCutter from 'cookie-cutter';
import useAtlasEcom from '@hooks/useAtlasEcom';

import styles from './Header.module.scss';

/**
 * A Header component
 * @param {Props} props The props object.
 * @param {string} props.className An optional className to be added to the container.
 * @return {React.ReactElement} The FeaturedImage component.
 */

let cx = className.bind(styles);

export default function Header({
  className,
  storeSettings,
  title,
  description,
  menuItems,
}) {
  const [isNavShown, setIsNavShown] = useState(false);
  const [isSignOutShown, setIsSignOutShown] = useState(false);

  const headerClasses = cx([styles.header, className]);
  const navClasses = cx([
    styles['primary-navigation'],
    isNavShown ? styles['show'] : undefined,
  ]);

  var storeLogo = null;
  try {
    storeLogo =
      storeSettings?.nodes[0].storeLogo != undefined
        ? JSON.parse(storeSettings?.nodes[0].storeLogo)
        : '';
  } catch (err) {
    console.log('error', err);
  }

  // If the auth token already exists, redirect to the BC Account page
  useEffect(() => {
    // Get token
    const authToken = cookieCutter.get('atlasecom-token-user');

    if (typeof authToken !== 'undefined') {
      console.log('token exists');
      setIsSignOutShown(true);
    }
  }, [isSignOutShown]);

  function clearCookie() {
    console.log('clear');
    cookieCutter.set('atlasecom-token-user', '', {
      path: '/',
      expires: new Date(0),
    });
    setIsSignOutShown(false);
  }

  return (
    <header
      className={headerClasses}
      style={{
        backgroundColor: storeSettings?.storePrimaryColor,
        color: storeSettings?.storeSecondaryColor,
      }}
    >
      <SkipNavigationLink />
      <div className='container'>
        <div className={styles['bar']}>
          <div className={styles['logo']}>
            <Link href='/'>
              <a title='Home'>
                {storeLogo.url && <img src={storeLogo.url} alt='Store Logo' />}
                <h3 style={{ color: storeSettings?.storeSecondaryColor }}>
                  {title}
                </h3>
                <span style={{ color: storeSettings?.storeSecondaryColor }}>
                  {description}
                </span>
              </a>
            </Link>
          </div>

          {isSignOutShown && (
            <div style={{ marginLeft: 'auto' }}>
              <a
                className={styles['sign-out']}
                href='/my-account'
                onClick={clearCookie}
              >
                Sign Out
              </a>
            </div>
          )}

          <div className={styles['search']}>
            <Link href='/search'>
              <a>
                <FaSearch
                  title='Search'
                  role='img'
                  style={{ fill: storeSettings?.storeSecondaryColor }}
                />
              </a>
            </Link>
          </div>

          <button
            type='button'
            className={styles['nav-toggle']}
            onClick={() => setIsNavShown(!isNavShown)}
            aria-label='Toggle navigation'
            aria-controls={styles['primary-navigation']}
            aria-expanded={isNavShown}
          >
            <FaBars />
          </button>
        </div>

        <div className={styles['bar']}>
          <NavigationMenu
            id={styles['primary-navigation']}
            className={navClasses}
            menuItems={menuItems}
          ></NavigationMenu>

          <CartQuickView storeSettings={storeSettings} />
        </div>
      </div>
    </header>
  );
}

function CartQuickView({ storeSettings }) {
  const { cartData } = useAtlasEcom();

  let cartSubTotal = (0).toFixed(2);
  let cartItems = [];
  let cartCount = 0;

  if (cartData) {
    cartSubTotal = cartData.cart_amount.toFixed(2);
    cartItems = [].concat(
      cartData.line_items.physical_items,
      cartData.line_items.custom_items,
      cartData.line_items.digital_items,
      cartData.line_items.gift_certificates
    );
    cartCount = cartItems.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
  }

  return (
    <ul id='site-header-cart' className={styles['site-header-cart']}>
      <li className=''>
        <a
          className={styles['cart-contents']}
          href='#'
          title='View your shopping cart'
        >
          <span className={styles['price-amount']}>
            <span>$</span>
            {cartSubTotal}
          </span>{' '}
          <span className={styles['count']}>
            {cartCount} item{cartCount === 1 ? '' : 's'}
          </span>
          <span className={styles['icon-cart']}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 576 512'
              style={{ fill: storeSettings?.storeSecondaryColor }}
            >
              <path d='M171.7 191.1H404.3L322.7 35.07C316.6 23.31 321.2 8.821 332.9 2.706C344.7-3.409 359.2 1.167 365.3 12.93L458.4 191.1H544C561.7 191.1 576 206.3 576 223.1C576 241.7 561.7 255.1 544 255.1L492.1 463.5C484.1 492 459.4 512 430 512H145.1C116.6 512 91 492 83.88 463.5L32 255.1C14.33 255.1 0 241.7 0 223.1C0 206.3 14.33 191.1 32 191.1H117.6L210.7 12.93C216.8 1.167 231.3-3.409 243.1 2.706C254.8 8.821 259.4 23.31 253.3 35.07L171.7 191.1zM191.1 303.1C191.1 295.1 184.8 287.1 175.1 287.1C167.2 287.1 159.1 295.1 159.1 303.1V399.1C159.1 408.8 167.2 415.1 175.1 415.1C184.8 415.1 191.1 408.8 191.1 399.1V303.1zM271.1 303.1V399.1C271.1 408.8 279.2 415.1 287.1 415.1C296.8 415.1 304 408.8 304 399.1V303.1C304 295.1 296.8 287.1 287.1 287.1C279.2 287.1 271.1 295.1 271.1 303.1zM416 303.1C416 295.1 408.8 287.1 400 287.1C391.2 287.1 384 295.1 384 303.1V399.1C384 408.8 391.2 415.1 400 415.1C408.8 415.1 416 408.8 416 399.1V303.1z' />
            </svg>
          </span>
        </a>
      </li>
      {cartData ? (
        <li>
          <div className={styles['widget_shopping_cart']}>
            <div className={styles['widget_shopping_cart_content']}>
              <ul className={styles['product_list_widget']}>
                {cartItems.map((item) => (
                  <li className={styles['mini_cart_item']} key={item.id}>
                    <a href='#'>
                      <img
                        width='324'
                        height='324'
                        src={item.image_url}
                        className={styles['thumbnail']}
                        alt=''
                      ></img>
                      {item.name}
                    </a>
                    <span className={styles['quantity']}>
                      {item.quantity} ×{' '}
                      <span className={styles['price-amount']}>
                        <span>$</span>
                        {item.sale_price.toFixed(2)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className={styles['mini-cart__total']}>
                <strong>Subtotal:</strong>{' '}
                <span className={styles['price-amount']}>
                  <span>$</span>
                  {cartSubTotal}
                </span>
              </p>
              <p className={styles['mini-cart__buttons']}>
                <a
                  href={cartData?.redirect_urls.cart_url}
                  className={styles['button']}
                  target='_blank'
                  rel='noreferrer'
                >
                  View cart
                </a>
                <a
                  href={cartData?.redirect_urls.checkout_url}
                  className={styles['button']}
                >
                  Checkout
                </a>
              </p>
            </div>
          </div>
        </li>
      ) : null}
    </ul>
  );
}

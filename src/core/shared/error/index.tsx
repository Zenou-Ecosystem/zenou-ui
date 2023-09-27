import React from 'react';

export default function ErrorComponent ({ error, resetErrorBoundary }: any) {
  console.log({ error, resetErrorBoundary });
  return (
    <section className="section">
      <div className="container">
        <div className="is-max-w-md mx-auto has-text-centered">
          {/*<img className="mb-5 is-fullwidth p-4" src="metis-assets/illustrations/error2.png" alt="">*/}
            <span className="title has-text-primary">Whoops!</span>
            <h2 className="title is-spaced">Something went wrong!</h2>
            <p className="subtitle">Sorry, but we are unable to open this page.</p>
            <div className="buttons is-centered"><a className="button is-primary" href="#">Go back to Homepage</a><a
              className="button is-light" href="#">Try Again</a></div>
        </div>
      </div>
    </section>
  )
}

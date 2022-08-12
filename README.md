# Noneuclid js

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

Implementation of Algebraic Model for Geometry on Manifold with Constant Intrinsic Curvature (AMGM-CIC)

This project is part of the course in Mahidol Wittayanusorn School.

[**Explore the docs »**][docs-url]

[View Demo](https://30ma19-02.github.io/)
·
[Report Bug](https://github.com/30MA19-02/noneuclid/issues)
·
[Request Feature](https://github.com/30MA19-02/noneuclid/issues)

## Getting Started

1. Clone the repo

   ```sh
   git clone https://github.com/30MA19-02/noneuclid.git
   ```

2. Install NPM packages

   ```sh
   npm install
   ```

3. Import the library

   ```js
   import Manifold from "noneuclid";
   ```

## Usage

To create a manifold, call the `Manifold` constructor specifying the dimensionality and the curvature.
The result is a factory defining the point on the requested manifold.

   ```js
   Manifold(dim, lambda);
      // dim    = number of dimensions.
      // lambda = linear sectional curvature
   ```

Here are some examples:

   ```js
   // Two-dimensional geometry
   const spherical  = Manifold(2, +1); // Geometry on a unit sphere (spherical geometry)
   const euclidean  = Manifold(2, +0); // Geometry on a Euclidean plane (Euclidean geometry)
   const hyperbolic = Manifold(2, -1); // Geometry on a unit pseudosphere (hyperbolic geometry)
   ```

The factory can now be used to generate point (`manifold.Point`) and distance-preserving transformations.
Those objects can now perform any expected calculation including

* transformed with another transformation via `point.transform(other)`,
* evaluate inner product with other transformation via `point.inner_prod(other)`,
* project into an $n+1$-dimensional space via `point.project`,
* and embed into an $n$-dimensional space via `point.embed`.

_For more examples, please refer to the [Documentation][docs-url]_

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

[contributors-shield]: https://img.shields.io/github/contributors/30MA19-02/noneuclid.svg?style=for-the-badge
[contributors-url]: https://github.com/30MA19-02/noneuclid/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/30MA19-02/noneuclid.svg?style=for-the-badge
[forks-url]: https://github.com/30MA19-02/noneuclid/network/members
[stars-shield]: https://img.shields.io/github/stars/30MA19-02/noneuclid.svg?style=for-the-badge
[stars-url]: https://github.com/30MA19-02/noneuclid/stargazers
[issues-shield]: https://img.shields.io/github/issues/30MA19-02/noneuclid.svg?style=for-the-badge
[issues-url]: https://github.com/30MA19-02/noneuclid/issues
[license-shield]: https://img.shields.io/github/license/30MA19-02/noneuclid.svg?style=for-the-badge
[license-url]: https://github.com/30MA19-02/noneuclid/blob/develop/LICENSE
[docs-url]: https://30ma19-02.github.io/noneuclid

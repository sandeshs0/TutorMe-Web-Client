

const Footer = () => {
  return (
    <div className="bg-[#F8EDE7] font-poppins">
      {/* Footer Content */}
      <footer className="footer p-10 text-gray-700">
        {/* Logo and Description */}
        <div>
          <img src="src/assets/logo.png" alt="TutorMe Logo" className="h-14 mb-4" />
          <p className="text-lg leading-6">
           Expert guidance, anytime, anywhere.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-gray-700 hover:text-red-500">
              <i className="fab fa-instagram text-3xl"></i>
            </a>
            <a href="#" className="text-gray-700 hover:text-black">
              <i className="fab fa-x-twitter text-3xl"></i>
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-500">
              <i className="fab fa-facebook text-3xl"></i>
            </a>
          </div>
        </div>

        {/* For Students Section */}
        <div>
          <h4 className="text-lg font-semibold mb-2">For Students</h4>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:text-blue-500">
                Find Tutors
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500">
                Terms and Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* For Freelancers Section */}
        <div>
          <h4 className="text-lg font-semibold mb-2">For Freelancers</h4>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:text-blue-500">
                Become a Tutor
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500">
                How to optimize your profile?
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500">
                Terms and Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Call Us Section */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Reach Out</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              
              <i className="fas fa-map-marker-alt mr-2"></i> Dillibazar, Kathmandu
             
            </li>
            <li className="flex items-center">
            <a href="tel:+9779869118472" className="hover:text-blue-500">
              <i className="fas fa-phone-alt mr-2"></i>+977 9869118472
          </a>
            </li>
            <li className="flex items-center">
            <a href="mail:info@tutorme.com" className="hover:text-blue-500">

              <i className="fas fa-envelope mr-2"></i> info@tutorme.com
           </a>
            </li>
          </ul>
        </div>
      </footer>

      {/* Bottom Footer */}
      <footer className="text-center py-4 text-sm text-gray-600 border-t border-gray-200">
        Sandesh Sapkota (220272)
      </footer>
    </div>
  );
};

export default Footer;

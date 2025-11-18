const imageQueryFormat = "alternativeText formats url name width height";

const strapiQuerys = {
  Navbar: `{
        navbar {
            BurgerMenuIcon {
                ${imageQueryFormat}
            }
            LogOutButtonText
            Logo {
                ${imageQueryFormat}
            }
            NavigationMenu {
            LinkUrl
            Text
            }
            RegisterButtonText
            SignInButtonText
        }
    }`,
  Footer: `{
        footer {
            CopyrightText
        }        
    }`,
  Homepage: `{
        homepage {
            AddAPostButton {
                LinkUrl
                Text
            }
            PageHeader
            pagination_navbar {
                NextPageText
                PrevPageText
            }
        }
    }`,
  AboutUsPage: `{
        aboutUsPage {
            PageHeader
            Content
        }
    }`,
  CreateAPostPage: `{
        createAPostPage {
            PageHeader
            PostButtonText
            BackToPostsButton {
                LinkUrl
                Text
            }
        }
    }`,
  MyProfilePage: `{
        myProfilePage {
            PageHeader
            pagination_navbar {
                NextPageText
                PrevPageText
            }
        }
    }`,
  UsersPage: `{
        usersPage {
            PageHeader
            pagination_navbar {
                NextPageText
                PrevPageText
            }
        }
    }`,
  RegisterModal: `{
        registerModal {
            ConfirmationMessage
            DisclaimerText
            RegisterButtonText
            TextInputAriaText
        }
    }`,
  LogOutModal: `{
        logOutModal {
            AreYouSureMessage
            ConfirmationMessage
            LogInButtonText
        }
    }`,
  PostPage: `{
        postPage {
            PostedByText
            BackToPostsButton {
                LinkUrl
                Text
            }
        }
    }`,
};

export default strapiQuerys;

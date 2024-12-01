export default function PendingPage() {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Votre compte est en attente de validation</h1>
        <p>Veuillez contacter l'administrateur pour finaliser la validation.</p>
      </div>
    );
  }
  export function NotFound() {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Page introuvable</h1>
        <p>La page demandée n'existe pas.</p>
        <a href="/">Retour à l'accueil</a>
      </div>
    );
  }